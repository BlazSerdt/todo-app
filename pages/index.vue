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
      <button class="submit-button" @click="handleAddItem">
        <div class="button-content">
          <UIcon name="i-heroicons-plus-circle-16-solid" />
          <span>Add task</span>
        </div>
      </button>
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
            <tr v-if="todos.length === 0">
              <th colspan="3">No tasks found.</th>
            </tr>
            <tr v-for="todo in todos">
              <th>{{ todo.task }}</th>
              <th>{{ todo.formattedDate }}</th>
              <th>
                <div class="options-row">
                  <UButton
                      icon="i-heroicons-pencil-square"
                      size="sm"
                      color="orange"
                      square
                      variant="solid"
                  />
                  <UButton
                      icon="i-heroicons-check-circle"
                      size="sm"
                      color="green"
                      square
                      variant="solid"
                  />
                  <UButton
                      icon="i-heroicons-trash"
                      size="sm"
                      color="red"
                      square
                      variant="solid"
                  />
                </div>
              </th>
            </tr>
          </tbody>
        </table>
    </div>
    </div><button class="logout" @click="handleLogout">Log out</button>
  </div>
</template>