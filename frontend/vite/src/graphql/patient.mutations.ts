import gql from 'graphql-tag';

export const ADD_PATIENT = gql`
  mutation AddPatient(
    $clientPatientId: String!,
    $firstName: String!,
    $middleName: String,
    $lastName: String!,
    $age: String!,
    $gender: Int!,
    $dateOfBirth: String,
    $ageDobEstimated: Boolean,
    $clientUid: Int!,
    $phoneMobile: String!,
    $consentSms: Boolean,       
  ){
  createPatient(
      clientPatientId: $clientPatientId,
      firstName: $firstName,
      middleName: $middleName,
      lastName: $lastName,
      age: $age,
      gender: $gender,
      dateOfBirth: $dateOfBirth,
      ageDobEstimated: $ageDobEstimated,
      clientUid: $clientUid,
      phoneMobile: $phoneMobile,
      consentSms: $consentSms   
  ) {
    patient {
        uid
        clientPatientId
        patientId
        firstName
        middleName
        lastName
        age
        gender
        dateOfBirth
        ageDobEstimated
        client { 
          name
          district {
            name
            province {
              name
            }
          }
        }
        phoneHome
        phoneMobile
        consentSms
    }
  }
}`;