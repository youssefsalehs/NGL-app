import User from "../model/user.model.js";
export async function updateUserByEmail(email, updatedData) {
  const updatedAccount = await User.updateOne(
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
