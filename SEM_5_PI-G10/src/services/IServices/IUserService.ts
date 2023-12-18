import { Result } from "../../core/logic/Result";
import { IUserDTO } from "../../dto/IUserDTO";

export default interface IUserService  {
  listAllPendingUsers(): Result<IUserDTO[]> | PromiseLike<Result<IUserDTO[]>>;
  SignUp(userDTO: IUserDTO): Promise<Result<{userDTO: IUserDTO, token: string}>>;
  SignIn(email: string, password: string): Promise<Result<{ userDTO: IUserDTO, token: string }>>;
  createUser(userDTO: IUserDTO): Promise<Result<IUserDTO>>;
  downloadUserData(email: string): Promise<Result<IUserDTO>>;
  approveUser(email: string): Promise<Result<IUserDTO>>;
  disapproveUser(id: string): Promise<Result<IUserDTO>>;
  cancelAccount(email: string): Promise<boolean>;
}
