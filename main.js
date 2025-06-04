async function fetchStudents() {
  const res = await fetch('/api/students');
  let students = await res.json();
  const filter = studentSearchInput.value.toLowerCase();
  if (filter) {
    students = students.filter(s => s.name.toLowerCase().includes(filter) || s.grade.toLowerCase().includes(filter));
  }
  const table = document.getElementById('studentsTable');
  table.innerHTML = '';
  students.forEach(student => {
    const row = document.createElement('tr');
    if (editingStudentId === student.id) {
      row.innerHTML = `
        <td class="py-2 px-4 border-b"><input id="editStudentName" class="border p-1 rounded w-full" value="${student.name}"></td>
        <td class="py-2 px-4 border-b"><input id="editStudentGrade" class="border p-1 rounded w-full" value="${student.grade}"></td>
        <td class="py-2 px-4 border-b">
          <button onclick="saveStudent(${student.id})" class="bg-blue-500 text-white px-2 py-1 rounded">Save</button>
          <button onclick="cancelEditStudent()" class="bg-gray-400 text-white px-2 py-1 rounded">Cancel</button>
        </td>
      `;
    } else {
      row.innerHTML = `
        <td class="py-2 px-4 border-b">${student.name}</td>
        <td class="py-2 px-4 border-b">${student.grade}</td>
        <td class="py-2 px-4 border-b">
          <button onclick="editStudent(${student.id})" class="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
          <button onclick="deleteStudent(${student.id})" class="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
        </td>
      `;
    }
    table.appendChild(row);
  });
}

async function addStudent(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const grade = document.getElementById('grade').value;
  await fetch('/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, grade })
  });
  document.getElementById('studentForm').reset();
  fetchStudents();
}

async function deleteStudent(id) {
  await fetch(`/api/students/${id}`, { method: 'DELETE' });
  fetchStudents();
}

async function fetchTeachers() {
  const res = await fetch('/api/teachers');
  let teachers = await res.json();
  const filter = teacherSearchInput.value.toLowerCase();
  if (filter) {
    teachers = teachers.filter(t => t.name.toLowerCase().includes(filter) || t.subject.toLowerCase().includes(filter));
  }
  const table = document.getElementById('teachersTable');
  table.innerHTML = '';
  teachers.forEach(teacher => {
    const row = document.createElement('tr');
    if (editingTeacherId === teacher.id) {
      row.innerHTML = `
        <td class="py-2 px-4 border-b"><input id="editTeacherName" class="border p-1 rounded w-full" value="${teacher.name}"></td>
        <td class="py-2 px-4 border-b"><input id="editTeacherSubject" class="border p-1 rounded w-full" value="${teacher.subject}"></td>
        <td class="py-2 px-4 border-b">
          <button onclick="saveTeacher(${teacher.id})" class="bg-blue-500 text-white px-2 py-1 rounded">Save</button>
          <button onclick="cancelEditTeacher()" class="bg-gray-400 text-white px-2 py-1 rounded">Cancel</button>
        </td>
      `;
    } else {
      row.innerHTML = `
        <td class="py-2 px-4 border-b">${teacher.name}</td>
        <td class="py-2 px-4 border-b">${teacher.subject}</td>
        <td class="py-2 px-4 border-b">
          <button onclick="editTeacher(${teacher.id})" class="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
          <button onclick="deleteTeacher(${teacher.id})" class="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
        </td>
      `;
    }
    table.appendChild(row);
  });
  // Populate teacher dropdown for classes
  const select = document.getElementById('classTeacher');
  if (select) {
    select.innerHTML = '<option value="">Select Teacher</option>';
    teachers.forEach(teacher => {
      const option = document.createElement('option');
      option.value = teacher.id;
      option.textContent = teacher.name;
      select.appendChild(option);
    });
  }
}

async function addTeacher(e) {
  e.preventDefault();
  const name = document.getElementById('teacherName').value;
  const subject = document.getElementById('teacherSubject').value;
  await fetch('/api/teachers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, subject })
  });
  document.getElementById('teacherForm').reset();
  fetchTeachers();
}

async function deleteTeacher(id) {
  await fetch(`/api/teachers/${id}`, { method: 'DELETE' });
  fetchTeachers();
  fetchClasses();
}

// Add search/filter for classes
const classSearchInput = document.createElement('input');
classSearchInput.type = 'text';
classSearchInput.placeholder = 'Search classes...';
classSearchInput.className = 'border p-2 rounded mb-2 w-full';
classSearchInput.addEventListener('input', fetchClasses);
document.getElementById('classesTable').parentElement.insertBefore(classSearchInput, document.getElementById('classesTable'));

let editingClassId = null;

async function fetchClasses() {
  const res = await fetch('/api/classes');
  let classes = await res.json();
  const filter = classSearchInput.value.toLowerCase();
  if (filter) {
    classes = classes.filter(c => c.name.toLowerCase().includes(filter) || c.teacherName.toLowerCase().includes(filter));
  }
  const table = document.getElementById('classesTable');
  table.innerHTML = '';
  for (const cls of classes) {
    const row = document.createElement('tr');
    if (editingClassId === cls.id) {
      row.innerHTML = `
        <td class="py-2 px-4 border-b"><input id="editClassName" class="border p-1 rounded w-full" value="${cls.name}"></td>
        <td class="py-2 px-4 border-b">
          <select id="editClassTeacher" class="border p-1 rounded w-full"></select>
        </td>
        <td class="py-2 px-4 border-b">
          <button onclick="saveClass(${cls.id})" class="bg-blue-500 text-white px-2 py-1 rounded">Save</button>
          <button onclick="cancelEditClass()" class="bg-gray-400 text-white px-2 py-1 rounded">Cancel</button>
        </td>
      `;
      // Populate teacher dropdown
      const select = row.querySelector('#editClassTeacher');
      const teachersRes = await fetch('/api/teachers');
      const teachers = await teachersRes.json();
      teachers.forEach(teacher => {
        const option = document.createElement('option');
        option.value = teacher.id;
        option.textContent = teacher.name;
        if (teacher.id === cls.teacherId) option.selected = true;
        select.appendChild(option);
      });
    } else {
      row.innerHTML = `
        <td class="py-2 px-4 border-b">${cls.name}</td>
        <td class="py-2 px-4 border-b">${cls.teacherName}</td>
        <td class="py-2 px-4 border-b">
          <button onclick="editClass(${cls.id})" class="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
          <button onclick="deleteClass(${cls.id})" class="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
        </td>
      `;
    }
    table.appendChild(row);
  }
}

async function addClass(e) {
  e.preventDefault();
  const name = document.getElementById('className').value;
  const teacherId = document.getElementById('classTeacher').value;
  await fetch('/api/classes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, teacherId })
  });
  document.getElementById('classForm').reset();
  fetchClasses();
}

async function deleteClass(id) {
  await fetch(`/api/classes/${id}`, { method: 'DELETE' });
  fetchClasses();
}

document.getElementById('studentForm').addEventListener('submit', addStudent);
document.getElementById('teacherForm').addEventListener('submit', addTeacher);
document.getElementById('classForm').addEventListener('submit', addClass);
window.onload = () => {
  fetchStudents();
  fetchTeachers();
  fetchClasses();
};

// Add search/filter for students
const studentSearchInput = document.createElement('input');
studentSearchInput.type = 'text';
studentSearchInput.placeholder = 'Search students...';
studentSearchInput.className = 'border p-2 rounded mb-2 w-full';
studentSearchInput.addEventListener('input', fetchStudents);
document.getElementById('studentsTable').parentElement.insertBefore(studentSearchInput, document.getElementById('studentsTable'));

let editingStudentId = null;

window.editStudent = function(id) {
  editingStudentId = id;
  fetchStudents();
};
window.cancelEditStudent = function() {
  editingStudentId = null;
  fetchStudents();
};
window.saveStudent = async function(id) {
  const name = document.getElementById('editStudentName').value;
  const grade = document.getElementById('editStudentGrade').value;
  await fetch(`/api/students/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, grade })
  });
  editingStudentId = null;
  fetchStudents();
}

// Add search/filter for teachers
const teacherSearchInput = document.createElement('input');
teacherSearchInput.type = 'text';
teacherSearchInput.placeholder = 'Search teachers...';
teacherSearchInput.className = 'border p-2 rounded mb-2 w-full';
teacherSearchInput.addEventListener('input', fetchTeachers);
document.getElementById('teachersTable').parentElement.insertBefore(teacherSearchInput, document.getElementById('teachersTable'));

let editingTeacherId = null;

window.editTeacher = function(id) {
  editingTeacherId = id;
  fetchTeachers();
};
window.cancelEditTeacher = function() {
  editingTeacherId = null;
  fetchTeachers();
};
window.saveTeacher = async function(id) {
  const name = document.getElementById('editTeacherName').value;
  const subject = document.getElementById('editTeacherSubject').value;
  await fetch(`/api/teachers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, subject })
  });
  editingTeacherId = null;
  fetchTeachers();
  fetchClasses();
};
