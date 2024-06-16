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
  <div class="form-container">
    <Header title="LOGIN"/>
    <form class="form">
      <label for="email" class="form-label">E-Mail</label><br>
      <input type="text" id="email" name="email" class="form-input" v-model="email"><br>
      <label for="password" class="form-label">Password</label><br>
      <input type="password" id="password" name="password" class="form-input" v-model="password"><br>
    </form>
    <p class="error" v-if="errorMessage.length > 0">{{ errorMessage }}</p>
    <button class="submit-button" @click="handleLogin">Sign in</button>
    <NuxtLink to="/register"><a class="link">Dont have an account yet? Register here</a></NuxtLink>
  </div>
</template>