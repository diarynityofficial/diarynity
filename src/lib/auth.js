import { supabase } from "./supabaseClient";

export async function registerUser({
  email,
  password,
  username,
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  });

  if (error) {
    return { data, error };
  }

  const user = data?.user;

  if (user) {
    await supabase.from("profiles").insert({
      id: user.id,
      username: username,
      display_name: username,
    });
  }

  return { data, error };
}

export async function loginUser({
  email,
  password,
}) {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  return { data, error };
}

export async function logoutUser() {
  const { error } =
    await supabase.auth.signOut();

  return { error };
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}