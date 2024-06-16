<script setup>
  const client = useSupabaseClient();

  const email = ref('');
  const password = ref('');
  const errorMessage = ref('');
  const successMessage = ref('');

  async function handleRegister(){
    errorMessage.value = '';
    successMessage.value = '';

    try{
      const { data, error } = await client.auth.signUp({
        email: email.value,
        password: password.value
      });

      if(error) throw error;

      successMessage.value = "Check email to confirm account.";
    }
    catch(error){
      errorMessage.value = error.message;
    }
  }
</script>

<template>
  <div class="form-container">
    <Header title="REGISTER"/>
    <form class="form">
      <label for="email" class="form-label">E-Mail</label><br>
      <input type="text" id="email" name="email" class="form-input" v-model="email" autocomplete="off"><br>
      <label for="password" class="form-label">Password</label><br>
      <input type="password" id="password" name="password" class="form-input" v-model="password" autocomplete="off"><br>
    </form>
    <p class="error" v-if="errorMessage.length > 0">{{ errorMessage }}</p>
    <p class="success" v-if="successMessage.length > 0">{{ successMessage }}</p>
    <button class="submit-button" @click="handleRegister">Register</button>
    <NuxtLink to="/login"><a class="link">Already have an account? Login here</a></NuxtLink>
  </div>
</template>