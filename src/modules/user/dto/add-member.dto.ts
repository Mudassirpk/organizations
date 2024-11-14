export class AddMemberDTO {
  name: string;
  email: string;
  roleId: number;

  // TODO: later remove it as we will get userid from token
  adminId: number;
}
