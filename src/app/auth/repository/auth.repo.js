import User from "../../user/model/user.model.js";

export async function checkUserByEmail(email) {
  const user = await User.findOne({ email: email });
  return user;
}

export async function createUser(userData) {
  const newUser = await User.create(userData);
  return newUser;
}

export async function verifyAccount(email) {
  const updatedAccount = await User.updateOne(
    {
      email: email,
    },
    {
      isVerified: true,
    },
    {
      returnDocument: "after",
    },
  );
  return updatedAccount;
}
