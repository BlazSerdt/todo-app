<script setup>
  const username = ref('');
  const email = ref('');
  const password = ref('');

  function handleRegister(){
    if(!username.value || !email.value || !password.value){
      alert("Please fill out all fields.");
      return;
    }

    console.log("User: " + username.value);
    console.log("Email: " + email.value);
    console.log("Password: " + password.value);

    username.value = '';
    email.value = '';
    password.value = '';
  }
</script>

<template>
  <div class="form-container">
    <Header title="REGISTER"/>
    <form class="form">
      <label for="username" class="form-label">Username</label><br>
      <input type="text" id="username" name="username" class="form-input" v-model="username"><br>
      <label for="email" class="form-label">E-Mail</label><br>
      <input type="text" id="email" name="email" class="form-input" v-model="email"><br>
      <label for="password" class="form-label">Password</label><br>
      <input type="password" id="password" name="password" class="form-input" v-model="password"><br>
    </form>
    <button class="submit-button" @click="handleRegister">Register</button>
    <NuxtLink to="/login"><a class="link">Already have an account? Login here</a></NuxtLink>
  </div>
</template>