import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';

/**
 * Comment entity representing the 'comments' table in the database
 * This entity stores user comments on posts
 * @Entity - TypeORM decorator marking this as a database entity
 */
@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn({ name: 'COMMENT_ID' })
  COMMENT_ID: number;

  @Column({ type: 'int', name: 'POST_ID', nullable: false })
  POST_ID: number;

  @Column({ type: 'int', name: 'USER_ID', nullable: false })
  USER_ID: number;

  @Column({ type: 'text', name: 'CONTENT', nullable: false })
  CONTENT: string;

  @Column({ type: 'tinyint', name: 'IS_DELETED', nullable: false, default: 0 })
  IS_DELETED: number;

  @CreateDateColumn({ name: 'CREATED_AT', nullable: true })
  CREATED_AT?: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT', nullable: true })
  UPDATED_AT?: Date;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'USER_ID' })
  USER: User;

  /**
   * Many-to-One relationship with Post entity
   * Defines which post this comment belongs to
   * Eager loading disabled by default for performance
   */
  @ManyToOne(() => Post, (post) => post.COMMENTS, { eager: false })
  @JoinColumn({ name: 'POST_ID' })
  POST: Post;
}
