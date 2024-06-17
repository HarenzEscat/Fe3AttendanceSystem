import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput, Picker } from 'react-native';

const AttendanceSystem = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signingUp, setSigningUp] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [classes, setClasses] = useState([
    {
      id: 1,
      name: 'FE3',
      students: [
        { id: 1, name: 'Dugs', section: 'BSIT301', time: '', date: '', present: false },
        { id: 2, name: 'Pastor', section: 'BSIT301', time: '', date: '', present: false }
      ]
    },
    {
      id: 2,
      name: 'PMQA',
      students: [
        { id: 3, name: 'Gar', section: 'BSIT302', time: '', date: '', present: false },
        { id: 4, name: 'Ka-foodie', section: 'BSIT302', time: '', date: '', present: false }
      ]
    },
    {
      id: 3,
      name: 'CAPSTONE',
      students: [
        { id: 5, name: 'Vector', section: 'BSIT301', time: '', date: '', present: false },
        { id: 6, name: 'SirBugay', section: 'BSIT301', time: '', date: '', present: false }
      ]
    },
  ]);
  const [currentClass, setCurrentClass] = useState(null);
  const [newClassName, setNewClassName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [addingStudent, setAddingStudent] = useState(false);
  const [tempStudentName, setTempStudentName] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedClasses = [...classes];
      updatedClasses.forEach(cls => {
        cls.students.forEach(student => {
          if (student.time === '') {
            const now = new Date();
            student.time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
            student.date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
          }
        });
      });
      setClasses(updatedClasses);
    }, 1000);
    return () => clearInterval(interval);
  }, [classes]);

  const toggleAttendance = (classIndex, studentId) => {
    const updatedClasses = [...classes];
    const studentIndex = updatedClasses[classIndex].students.findIndex(student => student.id === studentId);
    if (studentIndex !== -1) {
      updatedClasses[classIndex].students[studentIndex].present = !updatedClasses[classIndex].students[studentIndex].present;
      setClasses(updatedClasses);
    }
  };

  const addClass = () => {
    if (newClassName.trim() === '') return;
    const newClass = {
      id: classes.length + 1,
      name: newClassName,
      students: [],
    };
    setClasses([...classes, newClass]);
    setNewClassName('');
  };

  const removeClass = (classIndex) => {
    const updatedClasses = classes.filter((_, index) => index !== classIndex);
    setClasses(updatedClasses);
    setCurrentClass(null);
  };

  const addStudent = (classIndex) => {
    setAddingStudent(true);
  };

  const confirmAddStudent = (classIndex) => {
    const newStudentId = classes[classIndex].students.length > 0 ? classes[classIndex].students[classes[classIndex].students.length - 1].id + 1 : 1;
    const newStudent = { id: newStudentId, name: tempStudentName, section: 'BSIT301', time: '', date: '', present: false };
    const updatedClasses = [...classes];
    updatedClasses[classIndex].students.push(newStudent);
    setClasses(updatedClasses);
    setAddingStudent(false);
    setTempStudentName('');
  };

  const removeStudent = (classIndex, studentId) => {
    const updatedClasses = [...classes];
    updatedClasses[classIndex].students = updatedClasses[classIndex].students.filter(student => student.id !== studentId);
    setClasses(updatedClasses);
  };

  const calculateAttendanceSummary = () => {
    if (currentClass === null) return '';

    const presentCount = classes[currentClass].students.filter((student) => student.present).length;
    const totalStudents = classes[currentClass].students.length;
    return `Present: ${presentCount}/${totalStudents}`;
  };

  const handleLogin = () => {
    // Simulate authentication (replace with actual authentication logic)
    if (username === 'admin' && password === 'admin') {
      setLoggedIn(true);
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };

  const handleSignUp = () => {
    // Simulate signup process (replace with actual signup logic)
    if (newUsername.trim() === '' || newPassword.trim() === '' || confirmPassword.trim() === '') {
      alert('Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match. Please try again.');
      return;
    }
    setUsername(newUsername); // Automatically login with new credentials after signing up
    setPassword(newPassword);
    setSigningUp(false);
    setLoggedIn(true); // Directly login after successful signup (simulated)
    alert('Sign up successful!');
  };

  const handleLogout = () => {
    // Perform logout action
    setLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  const handleSignUpToggle = () => {
    setSigningUp(true);
  };

  // Function to filter classes based on search text
  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Function to filter students based on search text
  const filteredStudents = currentClass !== null ? classes[currentClass].students.filter(student =>
    student.name.toLowerCase().includes(searchText.toLowerCase())
  ) : [];

  if (!loggedIn && !signingUp) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button title="Login" onPress={handleLogin} />
        <TouchableOpacity style={styles.linkButton} onPress={handleSignUpToggle}>
          <Text style={styles.linkText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    );
  } else if (!loggedIn && signingUp) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="New Username"
          value={newUsername}
          onChangeText={setNewUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <Button title="Sign Up" onPress={handleSignUp} />
        <TouchableOpacity style={styles.linkButton} onPress={() => setSigningUp(false)}>
          <Text style={styles.linkText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search input */}
      <TextInput
        style={[styles.input, styles.searchInput]}
        placeholder="Search Class or Student"
        value={searchText}
        onChangeText={setSearchText}
      />
      {currentClass !== null ? (
        <>
          <Text style={styles.title}>Attendance for {classes[currentClass].name}</Text>
          <View style={styles.studentContainer}>
            <Text style={styles.subtitle}>Students</Text>
            {/* Display filtered students */}
            {filteredStudents.map((student, index) => (
              <View key={student.id} style={styles.studentItem}>
                <TextInput
                  style={[styles.input, styles.studentNameInput]}
                  value={student.name}
                  onChangeText={(text) => {
                    const updatedClasses = [...classes];
                    const studentIndex = updatedClasses[currentClass].students.findIndex(s => s.id === student.id);
                    if (studentIndex !== -1) {
                      updatedClasses[currentClass].students[studentIndex].name = text;
                      setClasses(updatedClasses);
                    }
                  }}
                />
                <Picker
                  selectedValue={student.section}
                  style={{ height: 50, width: 100 }}
                  onValueChange={(itemValue) => {
                    const updatedClasses = [...classes];
                    const studentIndex = updatedClasses[currentClass].students.findIndex(s => s.id === student.id);
                    if (studentIndex !== -1) {
                      updatedClasses[currentClass].students[studentIndex].section = itemValue;
                      setClasses(updatedClasses);
                    }
                  }}
                >
                  <Picker.Item label="BSIT301" value="BSIT301" />
                  <Picker.Item label="BSIT302" value="BSIT302" />
                </Picker>
                <Text style={styles.timeDate}>{student.time === '' ? 'Waiting...' : `${student.time} - ${student.date}`}</Text>
                <TouchableOpacity
                  style={student.present ? styles.presentButton : styles.absentButton}
                  onPress={() => toggleAttendance(currentClass, student.id)}
                >
                  <Text style={styles.buttonText}>{student.present ? 'Present' : 'Absent'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeStudent(currentClass, student.id)}
                >
                  <Text style={styles.buttonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
            {addingStudent && (
              <View style={styles.studentItem}>
                <TextInput
                  style={[styles.input, styles.studentNameInput]}
                  placeholder="Enter Student Name"
                  value={tempStudentName}
                  onChangeText={(text) => setTempStudentName(text)}
                />
                <TouchableOpacity
                  style={styles.addButtonSmall}
                  onPress={() => confirmAddStudent(currentClass)}
                >
                  <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
              </View>
            )}
            {!addingStudent && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => addStudent(currentClass)}
              >
                <Text style={styles.buttonText}>Add Student</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={[styles.buttonContainer, { marginTop: 10 }]}>
            <Button title="Submit Attendance" onPress={() => {
              alert('Attendance submitted');
              setCurrentClass(null); // Reset currentClass state
            }} />
          </View>
          <View style={[styles.buttonContainer, { marginBottom: 10 }]}>
            <Button title="Export Attendance" onPress={() => {
              alert('Attendance exported!');
            }} />
          </View>
          <Text style={styles.summary}>{calculateAttendanceSummary()}</Text>
        </>
      ) : (
        <>
          <Text style={styles.title}>Class List</Text>
          <View style={styles.classList}>
            {/* Display filtered classes */}
            {filteredClasses.map((cls, index) => (
              <TouchableOpacity key={cls.id} style={styles.classItem} onPress={() => setCurrentClass(index)}>
                <Text style={styles.classText}>{cls.name}</Text>
                <TouchableOpacity style={styles.removeButton} onPress={() => removeClass(index)}>
                  <Text style={styles.buttonText}>Remove</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
            <View style={styles.addClassContainer}>
              <TextInput
                style={[styles.input, styles.addClassInput]}
                placeholder="Enter Class Name"
                value={newClassName}
                onChangeText={(text) => setNewClassName(text)}
              />
              <TouchableOpacity style={styles.addButton} onPress={addClass}>
                <Text style={styles.buttonText}>Add Class</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
      {/* Logout button */}
      <View style={styles.buttonContainer}>
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  classList: {
    width: '80%',
    marginBottom: 20,
  },
  classItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#FFFACD',
  },
  classText: {
    fontSize: 18,
    color: '#333',
  },
  removeButton: {
    backgroundColor: '#333',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  addClassContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  addButton: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addButtonSmall: {
    backgroundColor: '#333',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#333',
  },
  addClassInput: {
    flex: 1,
    marginRight: 10,
  },
  studentContainer: {
    width: '80%',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  studentNameInput: {
    flex: 1,
    marginRight: 10,
  },
  timeDate: {
    fontSize: 14,
    color: '#666',
  },
  presentButton: {
    backgroundColor: 'green',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  absentButton: {
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  summary: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  searchInput: {
    width: '80%',
    marginBottom: 10,
  },
  linkButton: {
    marginTop: 10,
  },
  linkText: {
    color: 'blue',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default AttendanceSystem;
