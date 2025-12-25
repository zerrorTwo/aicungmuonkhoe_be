import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import { Like } from './like.entity';

/**
 * Post entity representing the 'posts' table in the database
 * This entity stores user posts with title, content, and images
 * @Entity - TypeORM decorator marking this as a database entity
 */
@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn({ name: 'POST_ID' })
  POST_ID: number;

  @Column({ type: 'int', name: 'USER_ID', nullable: false })
  USER_ID: number;

  @Column({ type: 'varchar', length: 500, name: 'TITLE', nullable: false })
  TITLE: string;

  @Column({ type: 'longtext', name: 'CONTENT', nullable: false })
  CONTENT: string;

  @Column({ type: 'longtext', name: 'IMAGE_URL', nullable: true })
  IMAGE_URL?: string;

  @Column({ type: 'tinyint', name: 'STATUS', nullable: true, default: 1 })
  STATUS: number;

  @Column({ type: 'tinyint', name: 'IS_DELETED', nullable: false, default: 0 })
  IS_DELETED: number;

  @CreateDateColumn({ name: 'CREATED_AT', nullable: true })
  CREATED_AT?: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT', nullable: true })
  UPDATED_AT?: Date;

  /**
   * Many-to-One relationship with User entity
   * Defines the author of the post
   * Eager loading disabled by default for performance
   */
  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'USER_ID' })
  USER: User;

  /**
   * One-to-Many relationship with Comment entity
   * A post can have multiple comments
   */
  @OneToMany(() => Comment, (comment) => comment.POST, { cascade: true })
  COMMENTS: Comment[];

  /**
   * One-to-Many relationship with Like entity
   * A post can be liked by multiple users
   */
  @OneToMany(() => Like, (like) => like.POST, { cascade: true })
  LIKES: Like[];
}
