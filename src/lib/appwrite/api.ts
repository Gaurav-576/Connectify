import { INewUser } from "@/types";
import { ID, Query } from "appwrite"
import { account, appwriteConfig, avatars, databases } from "./config";

export async function createUserAccount(user: INewUser) {
  try {
    console.log("Hmm");
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );
    if(!newAccount)
      console.log("Hmm");
    const avatarURL = avatars.getInitials(user.name);
    const newUser= await saveUserToDB({
      accountId: newAccount.$id,
      email: newAccount.email,
      name: newAccount.name,
      imageURL: avatarURL,
      username: user.username
    })
    return newAccount;
  } catch (error) {
    console.log(error);
    console.log("New account is not being created")
    return error;
  }
}

export async function saveUserToDB (user: {
  accountId: string;
  email: string;
  name: string;
  imageURL: URL;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    )
    return newUser;
  } catch (error) {
    console.log("tera api chutiya hai")
  }
}

export async function signInAccount(user: {
  email: string,
  password: string;
}) {
  try {
    const session = await account.createSession(user.email, user.password);
    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();
    if(!currentAccount) throw Error;
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    )
    if(!currentUser) throw Error;
    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
}