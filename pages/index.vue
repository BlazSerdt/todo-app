<script setup>
  const client = useSupabaseClient();
  const router = useRouter();

  const task = ref('');
  const date = ref('');
  const todos = ref([]);

  const formattedDate = computed(() => {
    if (!date.value) return 'No due date'
    const [year, month, day] = date.value.split('-')
    return `${day}/${month}/${year}`
  })

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

  function handleAddItem(){
    if(!task.value){
      alert("Please enter a task");
      return;
    }

    todos.value.push({ task: task.value, formattedDate: formattedDate.value });

    task.value = '';
    date.value = '';
  }
</script>

<template>
  <div class="container">
    <div class="todo-container">
      <Header title="TODO LIST" />
      <form class="form">
        <input class="form-input" type="text" id="task" name="task" placeholder="Enter a task..." v-model="task" autocomplete="off">
        <input class="form-input" type="date" id="date" name="date" v-model="date">
      </form>
      <button class="submit-button" @click="handleAddItem"><strong>+</strong> Add task</button>
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
            <tr v-for="todo in todos">
              <th>{{ todo.task }}</th>
              <th>{{ todo.formattedDate }}</th>
              <th>
                <div>
                  buttons
                </div>
              </th>
            </tr>
          </tbody>
        </table>
    </div>
    </div><button class="logout" @click="handleLogout">Log out</button>
  </div>
</template>