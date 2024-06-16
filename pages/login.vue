<script setup>
  const username = ref('');
  const password = ref('');

  function handleLogin(){
    if (!username.value || !password.value) {
      alert('Please fill out all fields.');
      return;
    }

    console.log("User: " + username.value);
    console.log("Password: " + password.value);
  }
</script>

<template>
  <div class="login-container">
    <Header title="LOGIN"/>
    <form class="login-form">
      <label for="username" class="form-label">Username</label><br>
      <input type="text" id="username" name="username" class="form-input" v-model="username"><br>
      <label for="password" class="form-label">Password</label><br>
      <input type="password" id="password" name="password" class="form-input" v-model="password"><br>
    </form>
    <button class="login-button" @click="handleLogin">Sign in</button>
    <a class="register-link">Dont have an account yet? Click here</a>
  </div>
</template>