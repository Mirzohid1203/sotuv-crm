"use client";

import { useEffect, useState } from "react";
import { useCrmStore } from "@/store/crmStore";
import { Task } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Check, Clock, Plus, Trash2, Calendar } from "lucide-react";

export default function TasksPage() {
  const { tasks, customers, fetchTasks, fetchCustomers, addTask, updateTask, deleteTask } = useCrmStore();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchTasks();
    if (customers.length === 0) fetchCustomers();
  }, [fetchTasks, fetchCustomers, customers.length]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    await addTask({
      title: newTaskTitle,
      customerId: selectedCustomer || undefined,
      dueDate,
      completed: false,
      priority: "Medium"
    });

    setNewTaskTitle("");
    setSelectedCustomer("");
  };

  const toggleTaskStatus = async (task: Task) => {
    await updateTask(task.id, { completed: !task.completed });
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Tasks & Follow-ups</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your daily activities and customer follow-ups.</p>
      </div>

      <Card className="border-none shadow-sm ring-1 ring-gray-200/50 mb-8">
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleAddTask} className="flex flex-col gap-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-500" />
              Add New Task
            </h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input 
                placeholder="What needs to be done?" 
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1"
                required
              />
              <select 
                className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 md:w-48"
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
              >
                <option value="">No Customer Link</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <Input 
                type="date" 
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="md:w-auto"
                required
              />
              <Button type="submit" className="shrink-0 bg-indigo-600">Add Task</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900 px-1 flex items-center justify-between">
          <span>Your Tasks</span>
          <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
            {tasks.filter(t => !t.completed).length} pending
          </span>
        </h3>
        
        {tasks.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <Check className="w-12 h-12 text-gray-300 mb-3 mx-auto" />
            <h3 className="text-lg font-medium text-gray-900">All caught up!</h3>
            <p className="text-gray-500 mt-1">Add tasks above to keep track of your schedule.</p>
          </div>
        ) : (
          sortedTasks.map(task => {
            const customer = customers.find(c => c.id === task.customerId);
            const isOverdue = !task.completed && new Date(task.dueDate) < new Date(new Date().setHours(0,0,0,0));
            
            return (
              <Card 
                key={task.id} 
                className={`border-none shadow-sm transition group hover:shadow-md ${task.completed ? 'opacity-60 bg-gray-50/50' : 'bg-white ring-1 ring-gray-200/50'}`}
              >
                <CardContent className="p-4 flex items-start gap-4">
                  <button 
                    onClick={() => toggleTaskStatus(task)}
                    className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      task.completed 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : 'border-gray-300 hover:border-indigo-500 text-transparent hover:text-indigo-200'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <div className={`flex items-center gap-1.5 ${isOverdue ? 'text-rose-600 font-medium' : 'text-gray-500'}`}>
                        {isOverdue ? <Clock className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                        {new Date(task.dueDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        {isOverdue && " (Overdue)"}
                      </div>
                      
                      {customer && (
                        <div className="flex items-center gap-1.5 text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded-md">
                          <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                          {customer.name}
                        </div>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    title="Delete task"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
