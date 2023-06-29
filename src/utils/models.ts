import { Session } from "next-auth";

export interface User {
	id: string;
	username: string;
	email: string;
	avatar: string;
	followers: string[];
	following: string[];
	description: string;
	timestamp: Timestamp | Date;
}

interface Timestamp {
	seconds: number;
	nanoseconds: number;
}

export interface PostModel {
	id: string;
	userid: string;
	username: string;
	avatar: string;
	image: string;
	caption: string;
	timestamp: Timestamp | Date;
}

export interface CommentModel {
	id: string;
	userid: string;
	username: string;
	avatar: string;
	comment: string;
	timestamp: Timestamp;
}

export interface LikeModel {
	id: string;
	userid: string;
	username: string;
	avatar: string;
	timestamp: Timestamp;
}

export interface BookmarkModel {
	id: string;
	userid: string;
	username: string;
	avatar: string;
	timestamp: Timestamp;
}

export interface UserSession extends Session {
	user?: {
		name?: string | null;
		image?: string | null;
		email?: string | null;
		uid?: string | null;
	};
}
