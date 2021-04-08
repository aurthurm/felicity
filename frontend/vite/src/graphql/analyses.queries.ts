import gql from 'graphql-tag';

export const GET_ALL_SAMPLE_TYPES = gql`
    query getAllSampleTypes {
        sampleTypeAll {
            edges{
            node {
                uid
                name
                abbr
                description
                active
            }
        }
    }
}`;

export const GET_ALL_ANALYSES_SERVICES = gql`
    query getAllAnalysesServices {
        analysisAll{
            edges {
                node {
                    uid
                    name
                    keyword
                    active
                    categoryUid
                    category {
                        uid
                        name
                    }
                    profiles {
                        edges {
                            node {
                                uid
                                name
                            }
                    }
                }
            }
        }
    }
}`;

export const GET_ALL_ANALYSES_PROFILES = gql`
    query getAllAnalysesProfiles {
        profileAll {
            edges {
                node {
                    uid
                    name  
                    description
                    keyword
                    active
                    analyses {
                        edges {
                            node {
                                uid
                                name
                                keyword
                                active
                            }
                        }
                    }
                }
            }
        }
    }`;


export const GET_ALL_ANALYSES_PROFILES_AND_SERVICES = gql`
    query getAllProfilesANDServices {
        profileAll {
            edges {
                node {
                    uid
                    name  
                    description
                    keyword
                    active
                    analyses {
                        edges {
                            node {
                                uid
                                name
                                keyword
                                active
                            }
                        }
                    }
                }
            }
        }

        analysisAll{
            edges {
                node {
                    uid
                    name
                    keyword
                    active
                    categoryUid
                    category {
                        uid
                        name
                    }
                    profiles {
                      edges {
                        node {
                            uid
                            name
                        }
                   }
                }
            }
        }
        }

    }`;

export const GET_ALL_ANALYSES_CATEGORIES = gql`
    query getAllAnalysesCategories {
        analysisCategoryAll {
            edges {
                node {
                    uid
                    name
                    description
                    active
                }
            }
        }
    }`;


export const GET_ALL_SAMPLES = gql`
    query getAllSamples {
        sampleAll {
            edges {
                node {
                    uid
                    analysisrequest {
                        uid
                        clientRequestId
                        patient {
                            uid
                            firstName
                            lastName
                            clientPatientId
                            gender
                            dateOfBirth
                            age
                            ageDobEstimated
                            consentSms
                        }
                        client {
                            uid
                            name
                        }
                    }
                    sampletype {
                        uid
                        name
                    }
                    sampleId
                    priority
                    status
                    analyses {
                        edges {
                            node {
                                uid
                                name
                            }
                        }
                    }
                    profiles {
                        edges {
                            node {
                                uid
                                name
                            }
                        }
                    }
                }
            }
        }
    }`;


export const GET_ANALYSIS_REQUESTS_BY_PATIENT_UID = gql`
query getAnalysesRequestsByPatientUid($uid: String!) {
  analysisRequestsByPatientUid(uid: $uid) {
    uid
    clientRequestId
    patient {
      uid
      firstName
      lastName
      clientPatientId
      gender
      dateOfBirth
      age
      ageDobEstimated
      consentSms
    }
    client {
      uid
      name
    }
    samples {
      edges {
        node {
          uid
          sampletype {
            uid
            name
          }
          sampleId
          priority
          status
          analyses {
            edges {
              node {
                uid
                name
              }
            }
          }
          profiles {
            edges {
              node {
                uid
                name
              }
            }
          }
        }
      }
    }
  }

}`;

export const GET_ANALYSIS_RESULTS_BY_SAMPLE_UID = gql`
    query getAnalysesResultsBySampleUid($uid: String!) {
        analysisResultBySampleUid(uid: $uid) {
            uid
        status
        sampleUid
        result
        sample{
          uid
          sampleId
          status
          rejectionReasons {
            edges {
              node {
                uid
                reason
              }
            }
          }
        }
        analysisUid
        analysis{
          uid
          name
          unit
          resultoptions {
            edges {
              node {
                uid
                optionKey
                value
              }
            }
          }
        }
        createdAt
        createdByUid
        updatedAt
        updatedByUid
        }
    }`;


