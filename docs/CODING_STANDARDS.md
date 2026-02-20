# Estándares de Código - Gobierno Abierto Backend

Este documento define los estándares de código para el proyecto. Estos estándares aplican independientemente del IDE que uses (Cursor, VS Code, WebStorm, etc.).

## Tabla de Contenidos

- [TypeScript y NestJS](#typescript-y-nestjs)
- [Arquitectura](#arquitectura)
- [Base de Datos](#base-de-datos)
- [Manejo de PDFs](#manejo-de-pdfs)
- [Docker](#docker)
- [Manejo de Errores](#manejo-de-errores)
- [Testing](#testing)

## TypeScript y NestJS

### Convenciones de Nomenclatura

- **Clases**: PascalCase (`PdfService`, `CategoryController`)
- **Interfaces**: PascalCase (`PdfMetadata`, `ICategoryDto`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- **Variables y funciones**: camelCase (`pdfBuffer`, `validatePdfFormat`)
- **Archivos**: kebab-case (`pdf.service.ts`, `category.controller.ts`)

### Estructura de Archivos

```
src/
  pdfs/
    pdf.module.ts
    pdf.controller.ts
    pdf.service.ts
    pdf.entity.ts
    pdf.dto.ts
    pdf.service.spec.ts
  categories/
    category.module.ts
    category.controller.ts
    category.service.ts
    category.entity.ts
    category.dto.ts
```

### Inyección de Dependencias

```typescript
// ✅ CORRECTO
@Injectable()
export class PdfService {
  constructor(
    @InjectRepository(PdfEntity) private pdfRepository: Repository<PdfEntity>,
    private readonly logger: Logger,
  ) {}
}

// ❌ INCORRECTO
constructor() {
  this.repository = new PdfRepository(); // Evitar 'new' directo
}
```

## Arquitectura

### Separación de Responsabilidades

- **Controllers**: Solo manejan HTTP, validación de entrada, y respuestas
- **Services**: Lógica de negocio y orquestación
- **Repositories/Entities**: Acceso a datos y modelos
- **DTOs**: Transferencia de datos y validación

### Estructura de Módulos

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([PdfEntity])],
  controllers: [PdfController],
  providers: [PdfService],
  exports: [PdfService], // Exportar servicios que otros módulos necesiten
})
export class PdfModule {}
```

## Base de Datos

### Entidades TypeORM

```typescript
@Entity('pdfs')
export class Pdf {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  filename: string;

  @Column({ type: 'bytea' }) // Para almacenar PDFs
  content: Buffer;

  @ManyToOne(() => Category, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
```

### Consultas

- Usar QueryBuilder para consultas complejas
- Cargar relaciones explícitamente cuando sea necesario
- Usar transacciones para operaciones múltiples relacionadas

## Manejo de PDFs

### Validación

```typescript
const ALLOWED_MIME_TYPES = ['application/pdf'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Validar tipo MIME, tamaño y header del PDF
```

### Almacenamiento

- Para archivos pequeños (< 1MB): PostgreSQL `bytea`
- Para archivos grandes: Sistema de archivos o S3/MinIO
- Considerar almacenamiento externo en producción

## Docker

### Dockerfile

- Usar multi-stage builds
- Imágenes Alpine para reducir tamaño
- Usar usuario no-root por seguridad
- Cachear capas de dependencias

### Docker Compose

- Configurar health checks para servicios dependientes
- Usar variables de entorno para configuración
- Definir volúmenes para datos persistentes

## Manejo de Errores

### Excepciones HTTP

```typescript
// Usar excepciones específicas de NestJS
throw new NotFoundException(`PDF con ID ${id} no encontrado`);
throw new BadRequestException('Solo se permiten archivos PDF');
throw new ConflictException(`Ya existe una categoría con el nombre "${name}"`);
```

### Logging

```typescript
this.logger.error(
  `Error al crear PDF: ${error.message}`,
  error.stack,
  'PdfService.create',
);
```

## Testing

### Estructura

- Tests unitarios: `*.spec.ts` junto al código
- Tests E2E: `test/*.e2e-spec.ts`
- Usar mocks para dependencias externas

### Ejemplo

```typescript
describe('PdfService', () => {
  it('debería encontrar todos los PDFs', async () => {
    // Arrange
    const pdfs = [new Pdf(), new Pdf()];
    mockRepository.find.mockResolvedValue(pdfs);

    // Act
    const result = await service.findAll();

    // Assert
    expect(result).toEqual(pdfs);
  });
});
```

## Herramientas de Validación

Este proyecto usa:

- **ESLint**: Para validación de código TypeScript
- **Prettier**: Para formateo consistente
- **TypeScript**: Para verificación de tipos

Ejecuta antes de commit:

```bash
npm run lint      # Validar código
npm run format    # Formatear código
npm run test      # Ejecutar tests
```

## Referencias

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Nota**: Si usas Cursor, las reglas en `.cursor/rules/` proporcionan guía automática basada en estos estándares. Si usas otro IDE, este documento sirve como referencia.
