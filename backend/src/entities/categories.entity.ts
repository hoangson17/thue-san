import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Products } from "./products.entity";

@Entity('categories')
export class Categories {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 30
    })
    name: string

    @OneToMany(() => Products, (product) => product.category)
    products: Products[];
}