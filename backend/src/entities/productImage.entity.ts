import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Products } from "./products.entity";

@Entity('product_images')
export class ProductImage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    url: string;

    @ManyToOne(() => Products, (product) => product.images, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: 'product_id' })
    product: Products; 
}
