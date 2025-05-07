 export const filterTasks = (tasks, searchQuery, filters) => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = filters.status
        ? task.status === filters.status
        : true;
      const matchesPriority = filters.priority
        ? task.priority === filters.priority
        : true;
      const matchesDue =
        filters.due === "overdue"
          ? new Date(task.dueDate) < new Date() && task.status !== "completed"
          : true;

      return matchesSearch && matchesStatus && matchesPriority && matchesDue;
    });
  };