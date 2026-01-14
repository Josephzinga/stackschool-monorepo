export const SEARCH_STUDENT_GQL = `
 query SearchStudent ($input: StudentSearchInput!) {
 searchStudent(filter: $input) {
   id
   firstname
   lastname
   matricule
   photo
   className
 }}
`;

export const COMPLETE_PARENT_STUDENT_GQL = `
  query CompleteParentStudent(!input: CompleteParentProfileInput) {
  completeParentProfile(input: $input) {
  }
  
  `;
export const SEARCH_SCHOOL_GQL = `
  query SearchSchool($input: SchoolSearchInput!) {
  searchSchool(filter: $input) {
  id 
  name
  address
  code
  logo
 }
  }`;
export const SEARCH_CLASSES_GQL = `
  query GetClassStudents($input: StudentSearchInput!) {
  getClassSubjects(filter: $input) {
    id
    name
    level
    section
    subjects {
      id
      name
      code
    }
  }
  }
 `;

export const GET_CLASSES_GQL = `
  query GetClasses($input: StudentSearchInput!) {
  getClassSubjects(filter: $input) {
  id
  name
  section
  }
  }
  `;
