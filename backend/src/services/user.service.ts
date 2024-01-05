import { Repository } from "typeorm";
import datasource from "../lib/datasource";
import User, { InputRegister } from "../entities/user.entity";

export default class UserService {
  db: Repository<User>;
  constructor() {
    this.db = datasource.getRepository(User);
  }

  async listUsers() {
    return this.db.find();
  }

  async findUserByEmail(email: string) {
    return await this.db.findOneBy({ email });
  }

  async findUserById(id: string) {
    return await this.db.findOneBy({ id });
  }

  async createUser({ email, password }: InputRegister) {
    const newUser = this.db.create({ email, password });
    return await this.db.save(newUser);
    // ou  directement : return await this.db.save({email, password});
  }

  async deleteUser(id: string) {
    const userToDelete = await this.findUserById(id);
    if (!userToDelete) {
      throw new Error("L'utilisateur n'existe pas!");
    }

    await this.db.remove(userToDelete);
    return { success: true, message: "L'utilisateur a été supprimé avec succès !" };
  }

  async updateUserRole(id: string, role: string) {
    const userToUpdate = await this.findUserById(id);
    if (!userToUpdate) return { success: false, message: "L'utilisateur n'existe pas !" };
    if (userToUpdate.role === role.toUpperCase()) return { success: false, message: "L'utilisateur à déjà ce rôle !" };
    userToUpdate.role = role.toUpperCase();
    await this.db.save(userToUpdate);
    return { success: true, message: "Le rôle de l'utilisateur a été mis à jour avec succès !" };
  }
}
