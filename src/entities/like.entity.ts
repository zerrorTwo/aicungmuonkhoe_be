import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';

/**
 * Like entity representing the 'likes' table in the database
 * This entity stores user likes on posts
 * @Entity - TypeORM decorator marking this as a database entity
 */
@Entity('likes')
@Index(['USER_ID', 'POST_ID'], { unique: true }) // Composite unique constraint
export class Like {
  @PrimaryGeneratedColumn({ name: 'LIKE_ID' })
  LIKE_ID: number;

  @Column({ type: 'int', name: 'POST_ID', nullable: false })
  POST_ID: number;

  @Column({ type: 'int', name: 'USER_ID', nullable: false })
  USER_ID: number;

  @CreateDateColumn({ name: 'CREATED_AT', nullable: true })
  CREATED_AT?: Date;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'USER_ID' })
  USER: User;

  /**
   * Many-to-One relationship with Post entity
   * Defines which post was liked
   * Eager loading disabled by default for performance
   */
  @ManyToOne(() => Post, (post) => post.LIKES, { eager: false })
  @JoinColumn({ name: 'POST_ID' })
  POST: Post;
}
