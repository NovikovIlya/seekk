import { updateStatus } from '../../../models/myPractice'
import { apiSliceTeacher } from '../apiSliceTeacher'

export const practiceTeacherService = apiSliceTeacher.injectEndpoints({
    endpoints: builder => ({
        getAllPracticeTeacher: builder.query<any, void>({
            query: () => {
                return {
                    url: `/services/api-teacher-practices/practices/all`,
                    method: 'GET'
                }
            },
            providesTags: ['practiceTeacher']
          
        }),
        getOneGroup: builder.query<any, any>({
            query: (id) => {
                return {
                    url: `/services/api-teacher-practices/practices/${id}`,
                    method: 'GET'
                }
            },
            providesTags: ['practiceTeacher']
          
        }),
        getChat: builder.query<any, any>({
            query: (id) => {
                return {
                    url: `/services/api-teacher-practices/chat/${id}`,
                    method: 'GET'
                    
                }
            },
            providesTags: ['practiceTeacher'],
            keepUnusedDataFor: 1,
         
        }),
        sendMessage: builder.mutation<any, any>({
            query: (body) => {
                return {
                    url: `/services/api-teacher-practices/chat/send`,
                    method: 'POST',
                    body
                }
            },
            invalidatesTags: ['practiceTeacher']
          
        }),
        updateStatus: builder.mutation<any, updateStatus>({
            query: (body) => {
                return {
                    url: `/services/api-teacher-practices/practices/student/status`,
                    method: 'PATCH',
                    body
                }
            },
            invalidatesTags: ['practiceTeacher']
        }),
        getStatus: builder.query<any, any>({
            query: (id) => {
                return {
                    url: `/services/api-teacher-practices/practices/student/status?studentId=${id}`,
                    method: 'GET'
                }
            },
            providesTags: ['practiceTeacher']        
    }),
    })
})

export const {
    useGetAllPracticeTeacherQuery,
    useGetOneGroupQuery,
    useGetChatQuery,
    useSendMessageMutation,
    useUpdateStatusMutation,
    useGetStatusQuery
    
} = practiceTeacherService
