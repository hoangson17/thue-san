import { Column, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./productImage.entity";
import { Categories } from "./categories.entity";

@Entity('products')
export class Products {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @OneToMany(() => ProductImage, (image) => image.product, {
        cascade: true,
    })
    images: ProductImage[];

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    price: number;

    @Column({ type: 'int', default: 0 })
    stock: number;

    @Column({ default: true })
    is_active: boolean;
    
    @ManyToOne(() => Categories, (category) => category.products,{ onDelete: 'SET NULL' })
    @JoinColumn({ name: 'category_id' })
    category: Categories;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
 