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

  // if editMode is true, update selected item, if false, treat as new item and insert
  const editMode = ref(false);
  const editedTodo = ref({
    id: 0,
    task: '',
    date: '',
    status: false,
  })

  // todos holds all todos, while displayedTodos will change based on what filter user applies
  const displayedTodos = ref([]);
  const currentFilter = ref('all');

  let filterAllActive = true;
  let filterPendingActive = false;
  let filterCompletedActive = false;

  // this highlights the button that was clicked to indicate what filter is used
  watch(currentFilter, () => {
    if(currentFilter.value === 'all'){
      filterAllActive = true;
      filterPendingActive = false;
      filterCompletedActive = false;
    }
    else if(currentFilter.value === 'pending'){
      filterAllActive = false;
      filterPendingActive = true;
      filterCompletedActive = false;
    }
    else{
      filterAllActive = false;
      filterPendingActive = false;
      filterCompletedActive = true;
    }
  })

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

          displayedTodos.value = todos.value;
        }
      }
      catch(error){
        console.log(error.message);
      }
    }
  }

  // function that gets called when you click Add task/Save task,
  // then calls appropriate function depending on if your in editMode or not
  function handleClick(){
    if(editMode.value){
      handleUpdateItem();
    }
    else{
      handleAddItem();
    }
  }

  async function handleAddItem(){
    if(!task.value){
      errorMessage.value = 'Please enter task name.';
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
      errorMessage.value = '';

      filterTodos();
    }
    catch(error){
      errorMessage.value = "Error while inserting todo";
      console.log(error.message);
    }
  }

  async function handleUpdateItem(){
    try{
      if(!date.value){
        date.value = null;
      }

      const { error } = await client.from('todos').update({ task: task.value, due_date: date.value }).eq('id', editedTodo.value.id);
      if(error) throw error;

      // edits tasks list to have updated info
      const indexToUpdate = todos.value.findIndex((todo) => todo.id === editedTodo.value.id);
      todos.value[indexToUpdate].task = task.value;
      todos.value[indexToUpdate].date = formattedDate.value;

      // reset editMode and editedTodo
      editMode.value = false;
      editedTodo.value = {
        id: 0,
        task: '',
        date: '',
        status: false,
      }

      task.value = '';
      date.value = '';

      filterTodos();
    }
    catch(error){
      errorMessage.value = "Error while updating todo";
    }
  }

  function handleEditItem(id){
    const indexToEdit = todos.value.findIndex((todo) => todo.id === id);
    const todoDate = todos.value[indexToEdit].date;

    // if there is a due date, it reformats it so correct format for date picker input
    if(todoDate !== 'No due date'){
      const [day, month, year] = todoDate.split('/');
      date.value = `${year}-${month}-${day}`;
    }

    task.value = todos.value[indexToEdit].task;

    editMode.value = true;
    editedTodo.value = todos.value[indexToEdit];

    filterTodos();
  }

  async function handleCompleteItem(id){
    try{
      const { error } = await client.from('todos').update({ completed: true }).eq('id', id);
      if(error) throw error;

      // removes deleted task from list
      const indexToDelete = todos.value.findIndex((todo) => todo.id === id);
      todos.value[indexToDelete].status = true;

      filterTodos();
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

      filterTodos();
    }
    catch(error){
      errorMessage.value = "Error while deleting todo";
      console.log(error.message);
    }
  }

  function filterTodos(){
    if(currentFilter.value === 'all'){
      displayedTodos.value = todos.value;
    } else if(currentFilter.value === 'pending'){
      displayedTodos.value = todos.value.filter((todo) => !todo.status);
    } else if(currentFilter.value === 'completed'){
      displayedTodos.value = todos.value.filter((todo) => todo.status);
    }
  }

  function showAll(){
    currentFilter.value = 'all';

    filterAllActive = true;
    filterPendingActive = false;
    filterCompletedActive = false;

    filterTodos();
  }

  function showPending(){
    currentFilter.value = 'pending';

    filterAllActive = false;
    filterPendingActive = true;
    filterCompletedActive = false;

    filterTodos();
  }

  function showCompleted(){
    currentFilter.value = 'completed';

    filterAllActive = false;
    filterPendingActive = false;
    filterCompletedActive = true;

    filterTodos();
  }
</script>

<template>
  <div class="flex flex-col items-center max-w-3xl">
    <div class="flex flex-col items-center p-5 border border-neutral-500 rounded-xl bg-neutral-700 form-shadow">
      <Header title="TODO LIST" />
      <form class="p-0 m-0 w-full">
        <input class="w-full py-4 px-5 mt-1.5 mb-4 bg-neutral-800 rounded-lg border border-green-800 focus:outline-none focus:ring-2 focus:ring-green-700 text-white" type="text" id="task" name="task" placeholder="Enter a task..." v-model.trim="task" autocomplete="off">
        <input class="w-full py-4 px-5 mt-1.5 mb-4 bg-neutral-800 rounded-lg border border-green-800 focus:outline-none focus:ring-2 focus:ring-green-700 text-white" type="date" id="date" name="date" v-model="date">
      </form>
      <p class="text-red-600 mb-2" v-if="errorMessage.length > 0">{{ errorMessage }}</p>
      <button class="py-3 px-4 mb-2.5 rounded-lg border-0 bg-green-600 hover:bg-green-700 text-base" @click="handleClick">
        <div class="flex items-center" v-if="!editMode">
          <UIcon name="i-heroicons-plus-circle-16-solid" class="mr-2"/>
          <span>Add task</span>
        </div>
        <div class="flex items-center" v-else>
          <UIcon name="i-heroicons-check-circle-16-solid" class="mr-2"/>
          <span>Save task</span>
        </div>
      </button>
      <div class="flex flex-row items-center w-full">
        <p class="text-base px-2.5 py-4">Filter list:</p>
        <button v-bind:class="{'filter-active': filterAllActive, 'filter-inactive': !filterAllActive}" @click="showAll">All</button>
        <button v-bind:class="{'filter-active': filterPendingActive, 'filter-inactive': !filterPendingActive}" @click="showPending">Pending</button>
        <button v-bind:class="{'filter-active': filterCompletedActive, 'filter-inactive': !filterCompletedActive}" @click="showCompleted">Completed</button>
      </div>
      <div class="border-0 rounded-lg w-full max-h-96 mt-1 overflow-y-scroll ">
        <table class="w-full p-0 border-spacing-0 rounded-lg table-fixed">
          <thead class="text-center">
            <tr class="bg-neutral-800">
              <th class="py-3 px-0 font-normal text-sm">TASK</th>
              <th class="py-3 px-0 font-normal text-sm">DUE DATE</th>
              <th class="py-3 px-0 font-normal text-sm">STATUS</th>
              <th class="py-3 px-0 font-normal text-sm">OPTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="displayedTodos.length === 0">
              <th class="font-normal p-2.5" colspan="4">No tasks found.</th>
            </tr>
            <tr v-for="todo in displayedTodos">
              <th class="font-normal text-sm py-2">{{ todo.task }}</th>
              <th class="font-normal text-sm py-2">{{ todo.date }}</th>
              <th class="font-normal text-sm py-2">{{ todo.status ? "Completed" : "Pending" }}</th>
              <th class="font-normal text-sm py-2">
                <div class="flex flex-row items-center justify-center gap-1.5 ">
                  <UButton v-if="!todo.status"
                      icon="i-heroicons-pencil-square"
                      size="sm"
                      color="orange"
                      square
                      variant="solid"
                      @click="handleEditItem(todo.id)"
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
    <button class="py-2.5 px-4 mt-4 border-0 rounded-lg bg-red-700 text-base hover:bg-red-600" @click="handleLogout">Log out</button>
  </div>
</template>