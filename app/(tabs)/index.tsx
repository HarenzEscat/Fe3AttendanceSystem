import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput, Picker } from 'react-native';

const AttendanceSystem = () => {
  const [classes, setClasses] = useState([
    { id: 1, name: 'FE3', students: [{ name: 'Dugs', section: 'BSIT301', time: '', date: '', present: false }, { name: 'Pastor', section: 'BSIT301', time: '', date: '', present: false }] },
    { id: 2, name: 'PMQA', students: [{ name: 'Gar', section: 'BSIT302', time: '', date: '', present: false }, { name: 'Ka-foodie', section: 'BSIT302', time: '', date: '', present: false }] },
    { id: 3, name: 'CAPSTONE', students: [{ name: 'Vector', section: 'BSIT301', time: '', date: '', present: false }, { name: 'SirBugay', section: 'BSIT301', time: '', date: '', present: false }] },
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

  const toggleAttendance = (classIndex, studentIndex) => {
    const updatedClasses = [...classes];
    updatedClasses[classIndex].students[studentIndex].present = !updatedClasses[classIndex].students[studentIndex].present;
    setClasses(updatedClasses);
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
    const newStudent = { name: tempStudentName, section: 'BSIT301', time: '', date: '', present: false };
    const updatedClasses = [...classes];
    updatedClasses[classIndex].students.push(newStudent);
    setClasses(updatedClasses);
    setAddingStudent(false);
    setTempStudentName('');
  };

  const removeStudent = (classIndex, studentIndex) => {
    const updatedClasses = [...classes];
    updatedClasses[classIndex].students = updatedClasses[classIndex].students.filter((_, index) => index !== studentIndex);
    setClasses(updatedClasses);
  };

  const calculateAttendanceSummary = () => {
    if (currentClass === null) return '';

    const presentCount = classes[currentClass].students.filter((student) => student.present).length;
    const totalStudents = classes[currentClass].students.length;
    return `Present: ${presentCount}/${totalStudents}`;
  };

  // Function to filter classes based on search text
  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Function to filter students based on search text
  const filteredStudents = currentClass !== null ? classes[currentClass].students.filter(student =>
    student.name.toLowerCase().includes(searchText.toLowerCase())
  ) : [];

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
              <View key={index} style={styles.studentItem}>
                <TextInput
                  style={[styles.input, styles.studentNameInput]}
                  value={student.name}
                  onChangeText={(text) => {
                    const updatedClasses = [...classes];
                    updatedClasses[currentClass].students[index].name = text;
                    setClasses(updatedClasses);
                  }}
                />
                <Picker
                  selectedValue={student.section}
                  style={{ height: 50, width: 150 }}
                  onValueChange={(itemValue, itemIndex) => {
                    const updatedClasses = [...classes];
                    updatedClasses[currentClass].students[index].section = itemValue;
                    setClasses(updatedClasses);
                  }}
                >
                  <Picker.Item label="BSIT301" value="BSIT301" />
                  <Picker.Item label="BSIT302" value="BSIT302" />
                </Picker>
                <Text style={styles.timeDate}>{student.time === '' ? 'Waiting...' : `${student.time} - ${student.date}`}</Text>
                <TouchableOpacity
                  style={student.present ? styles.presentButton : styles.absentButton}
                  onPress={() => toggleAttendance(currentClass, index)}
                >
                  <Text style={styles.buttonText}>{student.present ? 'Present' : 'Absent'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeStudent(currentClass, index)}
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
              <TouchableOpacity key={index} style={styles.classItem} onPress={() => setCurrentClass(index)}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#333',
  },
  addClassInput: {
    flex: 1,
    marginRight: 10,
    
  },
  studentContainer: {
    width: '50%',
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
    marginTop: 10,
  },
});

export default AttendanceSystem;
