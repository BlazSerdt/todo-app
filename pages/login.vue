<script setup>
  const client = useSupabaseClient();
  const router = useRouter();

  const email = ref('');
  const password = ref('');
  const errorMessage = ref('');

  async function handleLogin(){
    errorMessage.value = '';

    try{
      const { error } = await client.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      });

      if(error) throw error;

      router.push("/");

      email.value = '';
      password.value = '';
    }
    catch(error){
      errorMessage.value = error.message;
    }
  }
</script>

<template>
  <div class="flex flex-col items-center p-5 bg-neutral-700 rounded-xl border border-neutral-500 min-w-96 form-shadow">
    <Header title="LOGIN"/>
    <form class="p-0 m-0 w-full">
      <label for="email" class="form-label">E-Mail</label><br>
      <input type="text" id="email" name="email" class="w-full py-4 px-5 mt-1.5 mb-4 bg-neutral-800 rounded-lg border border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-700 text-white" v-model.trim="email" autocomplete="off"><br>
      <label for="password" class="form-label">Password</label><br>
      <input type="password" id="password" name="password" class="w-full py-4 px-5 mt-1.5 mb-4 bg-neutral-800 rounded-lg border border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-700 text-white" v-model.trim="password" autocomplete="off"><br>
    </form>
    <p class="text-red-600 mb-2" v-if="errorMessage.length > 0">{{ errorMessage }}</p>
    <button class="py-3 px-4 mb-2.5 rounded-lg border-0 bg-purple-600 hover:bg-purple-700 text-base" @click="handleLogin">Sign in</button>
    <NuxtLink to="/register"><a class="link">Dont have an account yet? Register here</a></NuxtLink>
  </div>
</template>