<script setup>
  definePageMeta({
    middleware: ["auth"],
  })

  onMounted(() => {
    fetchData();
  })

  const client = useSupabaseClient();
  const router = useRouter();

  const task = ref('');
  const date = ref('');
  const todos = ref([]);
  const errorMessage = ref('');

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

  async function fetchData(){
    // fetches logged in user, so it can be used in fetching the data that belongs to the user
    const { data: { user } } = await client.auth.getUser()

    if(user){
      try{
        const { data, error } = await client.from('todos').select("*").eq('user_id', user.id);
        if(error) throw error;

        if(data){
          data.forEach((todo) => {
            if(todo.date === null){
              todos.value.push({ id: todo.id, task: todo.task, date: 'No due date', status: todo.completed });
            }
            else{
              // if due_date has a set value, it will be in YYYY-MM-DD format, so set date.value to the date of the task,
              // which triggers the computed formattedDate to format the date
              date.value = todo.due_date;
              todos.value.push({ id: todo.id, task: todo.task, date: formattedDate.value, status: todo.completed });

              date.value = '';
            }
          });
        }
      }
      catch(error){
        console.log(error.message);
      }
    }
  }

  async function handleAddItem(){
    if(!task.value){
      alert("Please enter a task");
      return;
    }

    if(!date.value){
      date.value = null;
    }

    try{
      // creates new record and returns it to save id in local todos array
      // (otherwise id will be undefined and deleting wont work)
      const { data, error } = await client.from('todos').insert({
        task: task.value,
        due_date: date.value,
        completed: false,
      }).select();
      if(error) throw error;

      todos.value.push({ id: data[0].id, task: task.value, date: formattedDate.value, status: false });

      task.value = '';
      date.value = '';
    }
    catch(error){
      errorMessage.value = "Error while inserting todo";
      console.log(error.message);
    }
  }

  async function handleCompleteItem(id){
    try{
      const { error } = await client.from('todos').update({ completed: true }).eq('id', id);
      if(error) throw error;

      // removes deleted task from list
      const indexToDelete = todos.value.findIndex((todo) => todo.id === id);
      todos.value[indexToDelete].status = true;
    }
    catch(error){
      errorMessage.value = "Error while confirming todo";
      console.log(error.message);
    }
  }

  async function handleDeleteItem(id){
    try{
      const { error } = await client.from('todos').delete().eq('id',  id);
      if(error) throw error;

      // removes deleted task from list
      const indexToDelete = todos.value.findIndex((todo) => todo.id === id);
      todos.value.splice(indexToDelete, 1);
    }
    catch(error){
      errorMessage.value = "Error while deleting todo";
      console.log(error.message);
    }
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
      <p class="error" v-if="errorMessage.length > 0">{{ errorMessage }}</p>
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
              <th>STATUS</th>
              <th>OPTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="todos.length === 0">
              <th colspan="4">No tasks found.</th>
            </tr>
            <tr v-for="todo in todos">
              <th>{{ todo.task }}</th>
              <th>{{ todo.date }}</th>
              <th>{{ todo.status ? "Completed" : "Pending" }}</th>
              <th>
                <div class="options-row">
                  <UButton v-if="!todo.status"
                      icon="i-heroicons-pencil-square"
                      size="sm"
                      color="orange"
                      square
                      variant="solid"
                  />
                  <UButton v-if="!todo.status"
                      icon="i-heroicons-check-circle"
                      size="sm"
                      color="green"
                      square
                      variant="solid"
                      @click="handleCompleteItem(todo.id)"
                  />
                  <UButton
                      icon="i-heroicons-trash"
                      size="sm"
                      color="red"
                      square
                      variant="solid"
                      @click="handleDeleteItem(todo.id)"
                  />
                </div>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <button class="logout" @click="handleLogout">Log out</button>
  </div>
</template>