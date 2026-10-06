import User from "../model/user.model.js";
export async function updateUserByEmail(email, updatedData) {
  const updatedAccount = await User.findOneAndUpdate(
    {
      email: email,
    },
    updatedData,
    {
      returnDocument: "after",
    },
  );

  return updatedAccount;
}
export async function getAllUsers() {
  return User.find({ isDeleted: false }, { password: 0 });
}
