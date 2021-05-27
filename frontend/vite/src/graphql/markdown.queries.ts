import gql from 'graphql-tag'

export const GET_ALL_DOCUMENTS = gql`
  query getAllDocuments {
    documentAll {
      edges {
        node {
          uid
          name
          version
          status
          departmentUid
          department {
            uid
            name
          }
        }
      }
    }
  }`;


export const GET_DOCUMENT_BY_UID = gql`
  query getDocumentByUid($uid: String!) {
    documentByUid(uid: $uid){
      uid
      name
      version
      status
      content
      departmentUid
      department {
        uid
        name
      }
    }
  }`;
