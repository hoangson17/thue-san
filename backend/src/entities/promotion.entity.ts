import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('promotions')
export class Promotion {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 100 })
    title: string

    @Column({ type: 'varchar', length: 100 })
    description: string

    @Column({ type: 'varchar', length: 100 })
    image: string

    @Column({
        type: 'timestamp'
    })
    start_date: string

    @Column({
        type: 'timestamp'
    })
    end_date: string
}