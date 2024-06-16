<script setup>
  const client = useSupabaseClient();
  const router = useRouter();

  async function handleLogout(){
    try{
      const { error } = await client.auth.signOut();
      if(error) throw error;

      router.push("/login");
    }
    catch(error){
      console.log(error.message);
    }
  }
</script>

<template>
  <div class="container">
    <div class="todo-container">
      <Header title="TODO LIST" />
      <form class="form">
        <input class="form-input" type="text" id="task" name="task" placeholder="Enter a task..." autocomplete="off">
        <input class="form-input" type="date" id="date" name="date">
      </form>
      <button class="submit-button"><strong>+</strong> Add task</button>
      <div class="todo-list">
        <table class="tasks-table">
          <thead>
          <tr>
            <th>TASK</th>
            <th>DUE DATE</th>
            <th>OPTIONS</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <th>do something</th>
            <th>18.06.2024</th>
            <th>buttons</th>
          </tr>
          </tbody>
        </table>
    </div>
    </div><button class="logout" @click="handleLogout">Log out</button>
  </div>
</template>