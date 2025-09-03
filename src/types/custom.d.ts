declare module "passport-local-mongoose" {
    import { Schema } from "mongoose";
    import { Strategy } from "passport-local";
    import { PassportStatic } from "passport";
  
    interface Options {
      usernameField?: string;
      passwordField?: string;
    }
  
    interface PassportLocalSchema<T> extends Schema<T> {
      plugin: (plugin: any, options?: Options) => void;
    }
  
    interface PassportLocalModel<T> {
      authenticate(): any;
      register(user: any, password: string, cb: (err: any, user: any) => void): any;
      createStrategy(): Strategy;
    }
  
    function passportLocalMongoose(schema: Schema, options?: Options): void;
    export = passportLocalMongoose;
  }
  
  declare module "mongoose-findorcreate" {
    import { Schema, Model, Document } from "mongoose";
  
    interface FindOrCreateResult<T> {
      doc: T;
      created: boolean;
    }
  
    interface FindOrCreate {
      (
        conditions: any,
        doc: any,
        callback: (err: any, result: FindOrCreateResult<any>) => void
      ): void;
      (
        conditions: any,
        callback: (err: any, result: FindOrCreateResult<any>) => void
      ): void;
    }
  
    function findOrCreate(schema: Schema): void;
  
    // Extend mongoose Model with findOrCreate
    interface FindOrCreateModel<T extends Document> extends Model<T> {
      findOrCreate: FindOrCreate;
    }
  
    // 👇 Correct CommonJS style export
    export = findOrCreate;
  }
  

declare global {
  namespace Express {
    interface User {
      id: string;
      username?: string;
      googleId?: string;
    }
  }
}
