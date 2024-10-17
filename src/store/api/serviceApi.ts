import { time } from 'console'
import i18n from 'i18next'
import { url } from 'inspector'

import { IApproveRequest } from '../../api/types'
import {
	CategoryType,
	ChangeStageStatusType,
	ChatMessageType,
	DocumentDocumentation,
	DocumentLib,
	Documentation,
	Email,
	EmploymentDataType,
	EmploymentDocsType,
	EmploymentRequestType,
	EmploymentStageItemType,
	EmploymentStageStatusType,
	Exam,
	ICalendar,
	IPerformance,
	InterviewItemType,
	InterviewRequestType,
	InterviewViewResponseType,
	ReserveTimeRequestType,
	ResponceType,
	RespondItemType,
	SeekerStatusChangeType,
	Template,
	TypeSchedule,
	VacancyGroupedResponcesType,
	VacancyItemType,
	VacancyRequestItemType,
	VacancyRequestType,
	VacancyRequestViewType,
	VacancyRespondItemType,
	VacancyViewResponceType,
	respondStatus
} from '../reducers/type'

import { apiSlice } from './apiSlice'

//Крайне временное решение из-за того, что в КФУ всё ещё отсутствует роль даже соискателя, что уж говорить об учёте кадров,
//руководителе и т.д.
const seekerToken =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJJQU1pdHJvZmFub3ZAc3R1ZC5rcGZ1LnJ1IiwiaWF0IjoxNzExNTc3OTMwLCJleHAiOjE3MTE1ODg3MzAsInNjb3BlIjoidXNlciIsInJvbGVzIjpbeyJ1c2VySWQiOiIyNTMxNjIiLCJzZXNzaW9uSWQiOiIyNDAzMjI3MTQ4NzUxOTQ4Mjk3MzMwOTA0NzM1MzY2NyIsInNlc3Npb25IYXNoIjoiRDJBMjI1QTc0OTlGMUNFMTZDQkUwMkI5RjZDOTE3RTEiLCJkb2N1bWVudHNIYXNoIjoiQjI2Q0IwQzNFOEFDMzZENkEwQ0I1MTJDRjMwMjM3NzciLCJsb2dpbiI6IklBTWl0cm9mYW5vdiIsInR5cGUiOiJTRUVLRVIifV0sInNlc3Npb25JZCI6IjI0MDMyMjcxNDg3NTE5NDgyOTczMzA5MDQ3MzUzNjY3Iiwic2Vzc2lvbkhhc2giOiJEMkEyMjVBNzQ5OUYxQ0UxNkNCRTAyQjlGNkM5MTdFMSIsImFsbElkIjoiMTc4NDQwIiwiZW1haWwiOiJtaXRyb18wMkBtYWlsLnJ1In0.4dmYBUEDz9UzKxvxWtQhA6poTVwFOkRn-YoSzngfVUs'
const personnelDeparmentToken =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJTdWJCQXNhZHVsbG9ldkBzdHVkLmtwZnUucnUiLCJpYXQiOjE3MTE3MjQ1NDQsImV4cCI6MTcxMTczNTM0NCwic2NvcGUiOiJ1c2VyIiwicm9sZXMiOlt7InVzZXJJZCI6IjciLCJzZXNzaW9uSWQiOiIyNDA0NzM4MTc3NzI3MjIwMTMzMDkwNzU0ODQ2ODU5MSIsInNlc3Npb25IYXNoIjoiNTZEMTZENTNDOTc5MDk5MTk0QTY4OEY4Qjk0M0I0N0MiLCJkb2N1bWVudHNIYXNoIjoiQTdCMkI0MUU4MjQ4NDYzNkY2ODZDNTQ3NEY0NEREMjYiLCJsb2dpbiI6IlNCQXNhZHVsbG9ldiIsInR5cGUiOiJQRVJTT05ORUxfREVQQVJUTUVOVCJ9LHsidXNlcklkIjoiMzQ4NTQxIiwic2Vzc2lvbklkIjoiMjQwNDczODA1NjYxMjc2MDM3NTM5NjI3MjY1MTM0OTQiLCJzZXNzaW9uSGFzaCI6IkUzQUZFMTUzNUVCMTU3NEUyMkZCNUJDNEYxNUFERkUwIiwiZG9jdW1lbnRzSGFzaCI6IiIsImxvZ2luIjoiU3ViQkFzYWR1bGxvZXYiLCJ0eXBlIjoiRU1QTCJ9LHsidXNlcklkIjoiMzM2MDM3Iiwic2Vzc2lvbklkIjoiMjQwNDczODI0NDUwMjI3MTM5NzgzNzQ5OTMwNjk4MDciLCJzZXNzaW9uSGFzaCI6IjcxMEExMTFFM0FCN0Q4NDczNTVFOEM0QkUxMDI4RTZBIiwiZG9jdW1lbnRzSGFzaCI6IkEyMkE3NURCRTBBNzg4MDE4OTY4NjZCQjgzNUIxNDQxIiwibG9naW4iOiJTdUJBc2FkdWxsb2V2IiwidHlwZSI6IlNUVUQifV0sInNlc3Npb25JZCI6IjI0MDQ3MzgxNzc3MjcyMjAxMzMwOTA3NTQ4NDY4NTkxIiwic2Vzc2lvbkhhc2giOiI1NkQxNkQ1M0M5NzkwOTkxOTRBNjg4RjhCOTQzQjQ3QyIsImFsbElkIjoiMjM5MTc0IiwiZW1haWwiOiJCYXN1YmhvbmJla0BnbWFpbC5jb20ifQ.MMK47Gd4AKG8tPzmPAwgNq79zVEmfzdFCuoZjcXeW_o'
const supervisorToken =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJJQU1pdHJvZmFub3ZAc3R1ZC5rcGZ1LnJ1IiwiaWF0IjoxNzExNTc3OTMwLCJleHAiOjE3MTE1ODg3MzAsInNjb3BlIjoidXNlciIsInJvbGVzIjpbeyJ1c2VySWQiOiIzMTE0NjQiLCJzZXNzaW9uSWQiOiIyNDAzMjI3MTQ4NzUxOTQ4Mjk3MzMwOTA0NzM1MzY2NyIsInNlc3Npb25IYXNoIjoiRDJBMjI1QTc0OTlGMUNFMTZDQkUwMkI5RjZDOTE3RTEiLCJkb2N1bWVudHNIYXNoIjoiQjI2Q0IwQzNFOEFDMzZENkEwQ0I1MTJDRjMwMjM3NzciLCJsb2dpbiI6IklBTWl0cm9mYW5vdiIsInR5cGUiOiJTVVBFUlZJU09SIn1dLCJzZXNzaW9uSWQiOiIyNDAzMjI3MTQ4NzUxOTQ4Mjk3MzMwOTA0NzM1MzY2NyIsInNlc3Npb25IYXNoIjoiRDJBMjI1QTc0OTlGMUNFMTZDQkUwMkI5RjZDOTE3RTEiLCJhbGxJZCI6IjE3ODQ0MCIsImVtYWlsIjoibWl0cm9fMDJAbWFpbC5ydSJ9.idm4ua4nH3WUN0Z119KV2pC6Dqb7uw4Rf1PMiHiCZh4'
const accountingToken =
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJTdWJCQXNhZHVsbG9ldkBzdHVkLmtwZnUucnUiLCJpYXQiOjE3MTE3MjQ1NDQsImV4cCI6MTcxMTczNTM0NCwic2NvcGUiOiJ1c2VyIiwicm9sZXMiOlt7InVzZXJJZCI6IjciLCJzZXNzaW9uSWQiOiIyNDA0NzM4MTc3NzI3MjIwMTMzMDkwNzU0ODQ2ODU5MSIsInNlc3Npb25IYXNoIjoiNTZEMTZENTNDOTc5MDk5MTk0QTY4OEY4Qjk0M0I0N0MiLCJkb2N1bWVudHNIYXNoIjoiQTdCMkI0MUU4MjQ4NDYzNkY2ODZDNTQ3NEY0NEREMjYiLCJsb2dpbiI6IlNCQXNhZHVsbG9ldiIsInR5cGUiOiJBQ0NPVU5USU5HIn0seyJ1c2VySWQiOiIzNDg1NDEiLCJzZXNzaW9uSWQiOiIyNDA0NzM4MDU2NjEyNzYwMzc1Mzk2MjcyNjUxMzQ5NCIsInNlc3Npb25IYXNoIjoiRTNBRkUxNTM1RUIxNTc0RTIyRkI1QkM0RjE1QURGRTAiLCJkb2N1bWVudHNIYXNoIjoiIiwibG9naW4iOiJTdWJCQXNhZHVsbG9ldiIsInR5cGUiOiJFTVBMIn0seyJ1c2VySWQiOiIzMzYwMzciLCJzZXNzaW9uSWQiOiIyNDA0NzM4MjQ0NTAyMjcxMzk3ODM3NDk5MzA2OTgwNyIsInNlc3Npb25IYXNoIjoiNzEwQTExMUUzQUI3RDg0NzM1NUU4QzRCRTEwMjhFNkEiLCJkb2N1bWVudHNIYXNoIjoiQTIyQTc1REJFMEE3ODgwMTg5Njg2NkJCODM1QjE0NDEiLCJsb2dpbiI6IlN1QkFzYWR1bGxvZXYiLCJ0eXBlIjoiU1RVRCJ9XSwic2Vzc2lvbklkIjoiMjQwNDczODE3NzcyNzIyMDEzMzA5MDc1NDg0Njg1OTEiLCJzZXNzaW9uSGFzaCI6IjU2RDE2RDUzQzk3OTA5OTE5NEE2ODhGOEI5NDNCNDdDIiwiYWxsSWQiOiIyMzkxNzQiLCJlbWFpbCI6IkJhc3ViaG9uYmVrQGdtYWlsLmNvbSJ9.whTYFKMIqDfVA0Y8LM0kp4Pe4ZCXWAAoaJGvQcD5r_I'
//Требуется для преобразования нужным образом дат, приходящих у сервера
//В модуле трудоустройства
const seekerServiceResponcesDataTransformHandler = (
	response: VacancyRespondItemType[]
) => {
	return response.map(resp =>
		resp.type === 'RESERVE'
			? {
					...resp,
					responseDate: resp.responseDate.substring(0, 10)
			  }
			: { ...resp, respondDate: resp.respondDate.substring(0, 10) }
	)
}

export const serviceApi = apiSlice.injectEndpoints({
	endpoints: builder => ({
		getSchedule: builder.query<TypeSchedule, void>({
			query: () => `schedule-api/schedule`
		}),
		getPerformance: builder.query<IPerformance, void>({
			query: () => 'academic-performance-api/performance'
		}),
		getExamsSchedule: builder.query<Exam[], void>({
			query: () => 'study-plan-api/studyplan/examsSchedule'
		}),
		getStudyPlan: builder.query<ICalendar, void>({
			query: () => 'study-plan-api/studyplan'
		}),
		getEmail: builder.query<Email, void>({
			query: () => 'user-api/settings/emails'
		}),
		getTemplates: builder.query<Template[], void>({
			query: () => 'unified-center-api/templates'
		}),
		getPracticeDocuments: builder.query<Template[], void>({
			query: () => 'unified-center-api/practice-documents'
		}),
		getDocumentsLibraries: builder.query<DocumentLib[], void>({
			query: () => 'unified-center-api/documents/online-libraries'
		}),
		getDocumentsTemplates: builder.query<DocumentLib[], void>({
			query: () => 'unified-center-api/documents/templates'
		}),
		getDocumentsPractice: builder.query<DocumentLib[], void>({
			query: () => 'unified-center-api/documents/practice-documents'
		}),
		getDocumentsMy: builder.query<DocumentLib[], void>({
			query: () => 'unified-center-api/documents/my-documents'
		}),
		getDocumentsDocumentation: builder.query<DocumentDocumentation, void>({
			query: () => 'unified-center-api/documents/documentation'
		}),
		getMyQWEDocuments: builder.query<Template[], void>({
			query: () => 'unified-center-api/my-documents'
		}),
		getDocumentation: builder.query<Documentation, void>({
			query: () => 'unified-center-api/documentation'
		}),
		getPhoneUser: builder.query<Array<any>, void>({
			query: () => 'user-api/settings/phones'
		}),
		getCategories: builder.query<CategoryType[], void>({
			query: () => ({ url: 'http://localhost:8082/employment-api/v1/category' })
		}),
		getDirections: builder.query<{ title: string }[], string>({
			query: category => ({
				url:
					'http://localhost:8082/employment-api/v1/direction?category=' +
					category
			})
		}),
		getSubdivisions: builder.query<{ title: string }[], string>({
			query: category => ({
				url:
					'http://localhost:8082/employment-api/v1/subdivision?category=' +
					category
			})
		}),
		getVacancyView: builder.query<VacancyViewResponceType, number>({
			query: id => ({
				url: 'http://localhost:8082/employment-api/v1/vacancy/' + id
			})
		}),
		getVacancyPreviewByDirection: builder.query<
			VacancyItemType[],
			{ category: string; direction: string; page: number }
		>({
			query: ({ category, direction, page }) => ({
				url:
					'http://localhost:8082/employment-api/v1/vacancy/direction?category=' +
					category +
					'&direction=' +
					direction +
					'&page=' +
					page
			})
		}),
		getVacancyPreviewBySubdivision: builder.query<
			VacancyItemType[],
			{ category: string; subdivision: string; page: number }
		>({
			query: ({ category, subdivision, page }) => ({
				url:
					'http://localhost:8082/employment-api/v1/vacancy/subdivisions?category=' +
					category +
					'&subdivisions=' +
					subdivision +
					'&page=' +
					page
			})
		}),
		getSeekerResponds: builder.query<RespondItemType[], string>({
			query: status => ({
				url:
					'http://localhost:8082/employment-api/v1/seeker/responds?status=' +
					status,
				headers: {
					Authorization: `Bearer ${seekerToken}`
				}
			}),
			transformResponse: (response: RespondItemType[]) => {
				return response.map(resp => ({
					...resp,
					respondDate: resp.respondDate.substring(0, 10)
				}))
			}
		}),
		getVacancyGroupedResponces: builder.query<
			VacancyGroupedResponcesType[],
			{ category: string; direction?: string; role: string }
		>({
			query: ({ category, direction, role }) => ({
				url: `http://localhost:8082/employment-api/v1/responds/grouped?category=${category}${
					direction !== undefined ? '&direction=' + direction : ''
				}`,
				headers: {
					Authorization: `Bearer ${
						role === 'PERSONNEL_DEPARTMENT'
							? personnelDeparmentToken
							: supervisorToken
					}`
				}
			})
		}),
		getResponcesByVacancy: builder.query<
			VacancyRespondItemType[],
			{ id: number; status: string; role: string }
		>({
			query: ({ id, status, role }) => ({
				url: `http://localhost:8082/employment-api/v1/vacancy/${id}/responds?status=${status}`,
				headers: {
					Authorization: `Bearer ${
						role === 'PERSONNEL_DEPARTMENT'
							? personnelDeparmentToken
							: supervisorToken
					}`
				},
				keepUnusedDataFor: 0
			}),
			transformResponse: (response: VacancyRespondItemType[]) => {
				return response.map(resp => ({
					...resp,
					responseDate: resp.responseDate.substring(0, 10)
				}))
			}
		}),
		getRespondFullInfo: builder.query<VacancyRespondItemType, number>({
			query: id => ({
				url: `http://localhost:8082/employment-api/v1/respond/${id}`,
				headers: {
					Authorization: `Bearer ${personnelDeparmentToken}`
				}
			})
		}),
		getChatIdByRespondId: builder.query<
			{
				id: number
				respondInfo: VacancyRespondItemType & { vacancyId: number }
				unreadCount: number
				lastMessageDate: string
			},
			{ chatId: number; role: string }
		>({
			query: arg => ({
				url: `http://localhost:8082/employment-api/v1/respond/${arg.chatId}/chat?sender=${arg.role}`,
				headers: {
					Authorization: `Bearer ${
						arg.role === 'PERSONNEL_DEPARTMENT'
							? personnelDeparmentToken
							: seekerToken
					}`
				}
			})
		}),
		getUnreadMessagesCount: builder.query<
			number,
			{ chatId: number; role: string }
		>({
			query: ({ chatId, role }) => ({
				url: `http://localhost:8082/employment-api/v1/chat/${chatId}/unread-count?sender=${role}`,
				headers: {
					Authorization: `Bearer ${
						role === 'PERSONNEL_DEPARTMENT'
							? personnelDeparmentToken
							: seekerToken
					}`
				}
			}),
			keepUnusedDataFor: 0
		}),
		getChatMessages: builder.query<
			ChatMessageType[],
			{ chatId: number; lastMessageId?: number; size?: number; role: string }
		>({
			query: ({ chatId, lastMessageId, size, role }) => ({
				url: `http://localhost:8082/employment-api/v1/chat/${chatId}/messages?${
					lastMessageId !== undefined ? `last_message_id=${lastMessageId}&` : ''
				}${size !== undefined ? `size=${size}&` : ''}sender=${role}`,
				headers: {
					Authorization: `Bearer ${
						role === 'PERSONNEL_DEPARTMENT'
							? personnelDeparmentToken
							: seekerToken
					}`
				}
			})
		}),
		getSupervisorVacancy: builder.query<VacancyItemType[], void>({
			query: () => ({
				url: `http://localhost:8082/employment-api/v1/management/supervisor/vacancy`,
				headers: {
					Authorization: `Bearer ${supervisorToken}`
				}
			})
		}),
		getVacancyRequests: builder.query<VacancyRequestItemType[], string>({
			query: action => ({
				url: `http://localhost:8082/employment-api/v1/management/vacancy-requests${
					action === 'все' ? '' : `?action=${action}`
				}`,
				headers: {
					Authorization: `Bearer ${personnelDeparmentToken}`
				},
				keepUnusedDataFor: 0
			})
		}),
		getVacancyRequestView: builder.query<VacancyRequestViewType, number>({
			query: id => ({
				url: `http://localhost:8082/employment-api/v1/management/vacancy-requests/${id}`,
				headers: {
					Authorization: `Bearer ${personnelDeparmentToken}`
				}
			})
		}),
		getArchivedResponces: builder.query<VacancyRespondItemType[], void>({
			query: () => ({
				url: `http://localhost:8082/employment-api/v1/archive`,
				headers: {
					Authorization: `Bearer ${personnelDeparmentToken}`
				}
			}),
			transformResponse: (response: VacancyRespondItemType[]) => {
				return response.map(resp => ({
					...resp,
					responseDate: resp.responseDate.substring(0, 10)
				}))
			}
		}),
		getArchivedRespondFullInfo: builder.query<VacancyRespondItemType, number>({
			query: id => ({
				url: `http://localhost:8082/employment-api/v1/archive/${id}`,
				headers: {
					Authorization: `Bearer ${personnelDeparmentToken}`
				}
			})
		}),
		getReservedResponces: builder.query<VacancyRespondItemType[], string>({
			query: type => ({
				url: `http://localhost:8082/employment-api/v1/reserve?type=${type}`,
				headers: {
					Authorization: `Bearer ${personnelDeparmentToken}`
				}
			}),
			transformResponse: (response: VacancyRespondItemType[]) => {
				return response.map(resp => ({
					...resp,
					respondDate: resp.respondDate.substring(0, 10)
				}))
			}
		}),
		getReservedRespondFullInfo: builder.query<VacancyRespondItemType, number>({
			query: id => ({
				url: `http://localhost:8082/employment-api/v1/reserve/${id}`,
				headers: {
					Authorization: `Bearer ${personnelDeparmentToken}`
				}
			})
		}),
		getAllVacancies: builder.query<{ id: number; post: string }[], void>({
			query: () => ({
				url: `http://localhost:8082/employment-api/v1/vacancy/search/by-name`,
				headers: {
					Authorization: `Bearer ${personnelDeparmentToken}`
				}
			})
		}),
		getChatPreviews: builder.query<
			{
				id: number
				respondInfo: VacancyRespondItemType & { vacancyId: number }
				unreadCount: number
				lastMessageDate: string
			}[],
			{
				vacancyId: number | null
				status: string | null
				sort: 'ALL' | 'UNREAD' | null
				page: number
				pageSize: number
			}
		>({
			query: ({ vacancyId, status, sort, page, pageSize }) => ({
				url: `http://localhost:8082/employment-api/v1/chat?page=${page}&pageSize=${pageSize}${
					vacancyId ? `&vacancy_id=${vacancyId}` : ''
				}
				${status ? `&status=${status}` : ''}${sort ? `&chat_sort=${sort}` : ''}`,
				headers: {
					Authorization: `Bearer ${personnelDeparmentToken}`
				}
			})
		}),
		getSeekerEmploymentResponds: builder.query<RespondItemType[], void>({
			query: () => ({
				url: 'http://localhost:8082/employment-api/v1/seeker/responds?status=все',
				headers: {
					Authorization: `Bearer ${seekerToken}`
				}
			}),
			transformResponse: (response: RespondItemType[]) => {
				// return response.map(resp => ({
				// 	...resp,
				// 	respondDate: resp.respondDate.substring(0, 10)
				// }))
				return response
					.filter(resp => resp.status === 'EMPLOYMENT')
					.map(resp => ({
						...resp,
						respondDate: resp.respondDate.substring(0, 10)
					}))
			}
		}),
		getEmploymentData: builder.query<EmploymentDataType, number>({
			query: respondId => ({
				url: `http://localhost:8082/employment-api/v1/respond/${respondId}/employment`,
				headers: { Authorization: `Bearer ${seekerToken}` }
			})
		}),
		getEmploymentDocs: builder.query<EmploymentDocsType[], number>({
			query: vacancyId => ({
				url: `http://localhost:8082/employment-api/v1/vacancy/${vacancyId}/empl-docs`,
				headers: { Authorization: `Bearer ${seekerToken}` }
			})
		}),
		getSupervisorResponds: builder.query<VacancyRespondItemType[], void>({
			query: () => ({
				url: `http://localhost:8082/employment-api/v1/supervisor/vacancy/respond`,
				headers: { Authorization: `Bearer ${supervisorToken}` }
			}),
			transformResponse: (response: VacancyRespondItemType[]) => {
				return response.map(resp => ({
					...resp,
					responseDate: resp.responseDate.substring(0, 10)
				}))
			}
		}),
		getSeekerResumeFile: builder.query<{ href: string; size: number }, number>({
			query: id => ({
				url: `http://localhost:8082/employment-api/v1/resume/${id}/file`,
				headers: { Authorization: `Bearer ${personnelDeparmentToken}` },
				responseHandler: async res => {
					const data = await res.blob()
					const file = new Blob([data], {
						type: res.headers.get('content-type') as string
					})
					return { href: window.URL.createObjectURL(file), size: file.size }
				}
			}),
			keepUnusedDataFor: 0
		}),
		postPhone: builder.mutation({
			query: phone => {
				return {
					url: 'user-api/settings/phones',
					body: phone,
					method: 'POST'
				}
			}
		}),
		changePassword: builder.mutation({
			query: ({
				newPassword,
				oldPassword
			}: {
				oldPassword: string
				newPassword: string
			}) => {
				return {
					url: 'user-api/settings/password',
					body: {
						newPassword,
						oldPassword
					},
					method: 'PUT'
				}
			}
		}),
		approveEmail: builder.mutation({
			query: (hash: IApproveRequest) => {
				return {
					url: 'user-api/register/approve',
					body: hash,
					method: 'POST'
				}
			}
		}),
		postEmail: builder.mutation({
			query: email => {
				return {
					url: 'user-api/settings/emails',
					body: email,
					method: 'POST'
				}
			}
		}),
		deleteAcc: builder.mutation({
			query: id => {
				return {
					url: `user-api/settings/emails/${id}`,
					method: 'DELETE'
				}
			}
		}),
		verifyAcc: builder.mutation({
			query: id => {
				return {
					url: `user-api/settings/emails/${id}/send-verification`,
					method: 'POST'
				}
			}
		}),
		setRole: builder.mutation({
			query: (body: { role: string }) => {
				return {
					url: 'user-api/users/me/role',
					body: body,
					method: 'POST'
				}
			}
		}),
		postVacancyRespond: builder.mutation<void, { id: number } & ResponceType>({
			query: arg => ({
				url:
					'http://localhost:8082/employment-api/v1/vacancy/' +
					arg.id +
					'/respond',
				method: 'POST',
				body: arg,
				headers: {
					Authorization: `Bearer ${seekerToken}`
				}
			})
		}),
		deleteVacancyRespond: builder.mutation<void, number>({
			query: id => ({
				url: `http://localhost:8082/employment-api/v1/respond/${id}`,
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${seekerToken}`
				}
			})
		}),
		postChatMessage: builder.mutation<
			ChatMessageType,
			{ id: number; text: string; name: string; role: string }
		>({
			query: ({ id, text, name, role }) => ({
				url: `http://localhost:8082/employment-api/v1/chat/${id}/text`,
				method: 'POST',
				body: { text: text, sender: role },
				headers: {
					Authorization: `Bearer ${
						role === 'PERSONNEL_DEPARTMENT'
							? personnelDeparmentToken
							: seekerToken
					}`,
					'X-User-Name': name
				}
			})
		}),
		readChatMessage: builder.mutation<
			void,
			{ chatId: number; messageId: number; sessionId: string; role: string }
		>({
			query: ({ chatId, messageId, sessionId, role }) => ({
				url: `http://localhost:8082/employment-api/v1/chat/${chatId}/message/${messageId}/read?sender=${role}`,
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${
						role === 'PERSONNEL_DEPARTMENT'
							? personnelDeparmentToken
							: seekerToken
					}`,
					'X-User-Name': sessionId
				}
			})
		}),
		approveRespond: builder.mutation<VacancyRespondItemType, number>({
			query: respondId => ({
				url: `http://localhost:8082/employment-api/v1/respond/${respondId}/status/approve`,
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${personnelDeparmentToken}`
				}
			})
		}),
		inviteSeeker: builder.mutation<
			VacancyRespondItemType,
			{
				respondId: number
				format: 'OFFLINE' | 'ONLINE'
				mainTime: string
				reservedTimes: string[]
				additionalInfo?: string
			}
		>({
			query: ({
				respondId,
				format,
				mainTime,
				reservedTimes,
				additionalInfo
			}) => ({
				url: `http://localhost:8082/employment-api/v1/respond/${respondId}/status/invite`,
				method: 'PUT',
				body: {
					format: format,
					mainTime: mainTime,
					reserveTimes: reservedTimes,
					address: additionalInfo
				},
				headers: {
					Authorization: `Bearer ${supervisorToken}`
				}
			})
		}),
		requestDeleteVacancy: builder.mutation<void, number>({
			query: id => ({
				url: `http://localhost:8082/employment-api/v1/management/vacancy-requests/for-delete`,
				method: 'POST',
				body: { vacancyId: id },
				headers: {
					Authorization: `Bearer ${supervisorToken}`
				}
			})
		}),
		requestCreateVacancy: builder.mutation<void, VacancyRequestType>({
			query: arg => ({
				url: `http://localhost:8082/employment-api/v1/management/vacancy-requests/for-create`,
				method: 'POST',
				body: arg,
				headers: {
					Authorization: `Bearer ${supervisorToken}`
				}
			})
		}),
		requestUpdateVacancy: builder.mutation<
			void,
			VacancyRequestType & { vacancyId: number }
		>({
			query: arg => ({
				url: `http://localhost:8082/employment-api/v1/management/vacancy-requests/for-update`,
				method: 'POST',
				body: arg,
				headers: {
					Authorization: `Bearer ${supervisorToken}`
				}
			})
		}),
		acceptCreateVacancyRequest: builder.mutation<
			void,
			{
				data: {
					category: string
					direction: string
					subdivision: string
					emplDocDefIds: number[]
				}
				requestId: number
			}
		>({
			query: arg => ({
				url: `http://localhost:8082/employment-api/v1/management/vacancy-requests/for-create/${arg.requestId}/acceptance`,
				method: 'PUT',
				body: arg.data,
				headers: {
					Authorization: `Bearer ${personnelDeparmentToken}`
				}
			})
		}),
		acceptUpdateVacancyRequest: builder.mutation<void, number>({
			query: id => ({
				url: `http://localhost:8082/employment-api/v1/management/vacancy-requests/for-update/${id}/acceptance`,
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${personnelDeparmentToken}`
				}
			})
		}),
		acceptDeleteVacancyRequest: builder.mutation<void, number>({
			query: id => ({
				url: `http://localhost:8082/employment-api/v1/management/vacancy-requests/for-delete/${id}/acceptance`,
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${personnelDeparmentToken}`
				}
			})
		}),
		denyVacancyRequest: builder.mutation<void, number>({
			query: id => ({
				url: `http://localhost:8082/employment-api/v1/management/vacancy-requests/${id}/deny`,
				method: 'POST',
				headers: {
					Authorization: `Bearer ${personnelDeparmentToken}`
				}
			})
		}),
		alterCreateVacancyRequest: builder.mutation<
			void,
			VacancyRequestType & { vacancyRequestId: number }
		>({
			query: body => ({
				url: `http://localhost:8082/employment-api/v1/management/vacancy-requests/for-create`,
				method: 'PATCH',
				body: body,
				headers: {
					Authorization: `Bearer ${personnelDeparmentToken}`
				}
			})
		}),
		alterUpdateVacancyRequest: builder.mutation<
			void,
			VacancyRequestType & { vacancyRequestId: number }
		>({
			query: body => ({
				url: `http://localhost:8082/employment-api/v1/management/vacancy-requests/for-update`,
				method: 'PATCH',
				body: body,
				headers: {
					Authorization: `Bearer ${personnelDeparmentToken}`
				}
			})
		}),
		sendRespondToArchive: builder.mutation<
			VacancyRespondItemType,
			{ id: number; role: string }
		>({
			query: ({ id, role }) => ({
				url: `http://localhost:8082/employment-api/v1/respond/${id}/status/archive`,
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${
						role === 'PERSONNEL_DEPARTMENT'
							? personnelDeparmentToken
							: supervisorToken
					}`
				}
			})
		}),
		deleteRespondFromArchive: builder.mutation<void, number>({
			query: id => ({
				url: `http://localhost:8082/employment-api/v1/archive/${id}`,
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${personnelDeparmentToken}`
				}
			})
		}),
		approveArchivedRespond: builder.mutation<VacancyRespondItemType, number>({
			query: respondId => ({
				url: `http://localhost:8082/employment-api/v1/archive/${respondId}/status/approve`,
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${personnelDeparmentToken}`
				}
			})
		}),
		answerToInivitationMainTime: builder.mutation<
			void,
			{ id: number; ans: string }
		>({
			query: ({ id, ans }) => ({
				url: `http://localhost:8082/employment-api/v1/respond/${id}/chat/buttons/interview/main-time?answer=${ans}`,
				method: 'POST',
				headers: {
					Authorization: `Bearer ${seekerToken}`
				}
			})
		}),
		sendRespondToReserve: builder.mutation<VacancyRespondItemType, number>({
			query: id => ({
				url: `http://localhost:8082/employment-api/v1/respond/${id}/status/reserve`,
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${personnelDeparmentToken}`
				}
			})
		}),
		approveReservedRespond: builder.mutation<
			VacancyRespondItemType,
			{ respondId: number; vacancyId: number }
		>({
			query: ({ respondId, vacancyId }) => ({
				url: `http://localhost:8082/employment-api/v1/reserve/${respondId}/approve`,
				method: 'POST',
				body: {
					vacancyId: vacancyId
				},
				headers: {
					Authorization: `Bearer ${personnelDeparmentToken}`
				}
			})
		}),
		editVacancyAsPerDepartment: builder.mutation<
			void,
			VacancyRequestType & {
				vacancyId: number
				category: string
				direction: string
			}
		>({
			query: arg => ({
				url: `http://localhost:8082/employment-api/v1/vacancy`,
				method: 'PATCH',
				body: arg,
				headers: {
					Authorization: `Bearer ${personnelDeparmentToken}`
				}
			})
		}),
		deleteVacancyAsPerDepartment: builder.mutation<void, number>({
			query: id => ({
				url: `http://localhost:8082/employment-api/v1/vacancy/${id}`,
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${personnelDeparmentToken}`
				}
			})
		}),
		requestCreateInterview: builder.mutation<void, InterviewRequestType>({
			query: arg => ({
				url: `http://localhost:8082/employment-api/v1/interview`,
				method: 'POST',
				body: arg,
				headers: {
					Authorization: `Bearer ${supervisorToken}`
				}
			})
		}),
		deleteReserveRespond: builder.mutation<void, number>({
			query: id => ({
				url: `http://localhost:8082/employment-api/v1/reserve/${id}`,
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${personnelDeparmentToken}`
				}
			})
		}),
		getSupervisorInterview: builder.query<InterviewItemType[], void>({
			query: arg => ({
				url: `http://localhost:8082/employment-api/v1/interview`,
				method: 'GET',
				body: arg,
				headers: {
					Authorization: `Bearer ${supervisorToken}`
				}
			})
		}),
		getInterviewView: builder.query<InterviewViewResponseType, number>({
			query: id => ({
				url: `http://localhost:8082/employment-api/v1/interview`,
				method: 'GET',
				headers: {
					Authorization: `Bearer ${supervisorToken}`
				}
			})
		}),
		employeeSeekerRequest: builder.mutation<
			void,
			SeekerStatusChangeType & { respondId: number }
		>({
			query: arg => ({
				url: `http://localhost:8082/employment-api/v1/respond/${arg.respondId}/status/employ`,
				method: 'PUT',
				body: {
					rejectionReason: arg.rejectionReason,
					action: arg.action
				},
				headers: {
					Authorization: `Bearer ${supervisorToken}`
				}
			})
		}),
		answerToInvitationReserveTimeRequest: builder.mutation<
			void,
			ReserveTimeRequestType & { respondId: number }
		>({
			query: arg => ({
				url: `http://localhost:8082/employment-api/v1/respond/${arg.respondId}/chat/buttons/interview/reserve-time`,
				method: 'POST',
				body: {
					time: arg.time ? arg.time : null
				},
				headers: {
					Authorization: `Bearer ${seekerToken}`
				}
			})
		}),
		answerEmploymentRequest: builder.mutation<
			void,
			EmploymentRequestType & { respondId: number }
		>({
			query: arg => ({
				url: `http://localhost:8082/employment-api/v1/respond/${arg.respondId}/chat/buttons/employment-request?answer=${arg.answer}`,
				method: 'POST',
				headers: {
					Authorization: `Bearer ${seekerToken}`
				}
			})
		}),
		deleteEmploymentDoc: builder.mutation<
			void,
			{ respondId: number; docId: number }
		>({
			query: ({ respondId, docId }) => ({
				url: `http://localhost:8082/employment-api/v1/respond/${respondId}/employment/file/${docId}`,
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${seekerToken}`
				}
			})
		}),
		sendEmploymentDocs: builder.mutation<
			void,
			{ respondId: number; hasNotRequisites: boolean }
		>({
			query: ({ respondId, hasNotRequisites }) => ({
				url: `http://localhost:8082/employment-api/v1/respond/${respondId}/employment/verification`,
				method: 'POST',
				headers: {
					Authorization: `Bearer ${seekerToken}`
				},
				body: hasNotRequisites
					? {
							acceptance: true,
							hasNotRequisites: hasNotRequisites
					  }
					: { acceptance: true }
			})
		}),
		getPersonnelStages: builder.query<EmploymentStageItemType[], void>({
			query: arg => ({
				url: `http://localhost:8082/employment-api/v1/management/employment`,
				method: 'GET',
				headers: {
					Authorization: `Bearer ${personnelDeparmentToken}`
				}
			})
		}),
		downloadFileEmploymentStages: builder.query<
			Blob,
			{ respondId: number; fileId: number }
		>({
			query: arg => ({
				url: `http://localhost:8082/employment-api/v1/respond/${arg.respondId}/employment/file/${arg.fileId}/`,
				method: 'GET',
				headers: {
					Authorization: `Bearer ${supervisorToken}`
				}
			})
		}),
		getEmploymentStageStatus: builder.query<
			EmploymentStageStatusType,
			{ respondId: number }
		>({
			query: arg => ({
				url: `http://localhost:8082/employment-api/v1/management/respond/${arg.respondId}/employment`,
				method: 'GET',
				headers: {
					Authorization: `Bearer ${personnelDeparmentToken}`
				}
			})
		}),
		getEmploymentReqStageStatus: builder.query<EmploymentStageStatusType, { respondId: number }> ({
			query: arg => ({
				url: `http://localhost:8082/employment-api/v1/management/respond/${arg.respondId}/employment`,
				method: 'GET',
				headers: {
					Authorization: `Bearer ${accountingToken}`
				}
			})
		}),
		changeEmploymentStageStatusRequest: builder.mutation<void, ChangeStageStatusType & { subStageId: number }> ( {
			query: arg => ({
				url: `http://localhost:8082/employment-api/v1/management/employment/sub-stage/${arg.subStageId}`,
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${personnelDeparmentToken}`
				},
				body: {
					status: arg.status,
					comment: arg.comment
				}
			})
		}),
		changeEmploymentStageAccountingStatusRequest: builder.mutation<void, ChangeStageStatusType & { subStageId: number }> ( {
			query: arg => ({
				url: `http://localhost:8082/employment-api/v1/management/employment/sub-stage/${arg.subStageId}`,
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${accountingToken}`
				},
				body: {
					status: arg.status,
					comment: arg.comment,
				}
			})
		}),
		downloadEmploymentStageFile: builder.query<Blob, { fileId : number }> ({
			query: arg => ({
				url: `http://localhost:8082/employment-api/v1/management/employment/sub-stage/${arg.fileId}`,
				method: 'GET',
				headers: {
					Authorization: `Bearer ${personnelDeparmentToken}`
				}
			})
		}),
		changeCardStatusRequest: builder.mutation<void, { subStageId: number }>({
			query: arg => ({
				url: `http://localhost:8082/employment-api/v1/management/employment/sub-stage/${arg.subStageId}/has-requisites`,
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${accountingToken}`
				}
			})
		}),
		agreeToWorkingConditions: builder.mutation<void, number>({
			query: respondId => ({
				url: `http://localhost:8082/employment-api/v1/respond/${respondId}/employment/working-conditions`,
				method: 'POST',
				headers: {
					Authorization: `Bearer ${seekerToken}`
				}
			})
		}),
		setHasNoRequisitesOnEmployment: builder.mutation<void, number>({
			query: respondId => ({
				url: `http://localhost:8082/employment-api/v1/respond/${respondId}/employment/requisites-missing`,
				method: 'POST',
				headers: {
					Authorization: `Bearer ${seekerToken}`
				}
			})
		})
	})
})
export const {
	useGetDocumentsDocumentationQuery,
	useGetDocumentsMyQuery,
	useGetDocumentsPracticeQuery,
	useGetDocumentsTemplatesQuery,
	useGetDocumentsLibrariesQuery,
	useGetPerformanceQuery,
	useVerifyAccMutation,
	useGetEmailQuery,
	useGetScheduleQuery,
	useGetExamsScheduleQuery,
	useGetStudyPlanQuery,
	useApproveEmailMutation,
	useSetRoleMutation,
	usePostEmailMutation,
	useChangePasswordMutation,
	useGetPhoneUserQuery,
	usePostPhoneMutation,
	useGetCategoriesQuery,
	useGetDirectionsQuery,
	useGetSubdivisionsQuery,
	usePostVacancyRespondMutation,
	useLazyGetVacancyViewQuery,
	useGetVacancyPreviewByDirectionQuery,
	useGetVacancyPreviewBySubdivisionQuery,
	useGetSeekerRespondsQuery,
	useGetVacancyGroupedResponcesQuery,
	useGetResponcesByVacancyQuery,
	useDeleteVacancyRespondMutation,
	useGetChatIdByRespondIdQuery,
	useGetUnreadMessagesCountQuery,
	useLazyGetChatMessagesQuery,
	usePostChatMessageMutation,
	useReadChatMessageMutation,
	useLazyGetResponcesByVacancyQuery,
	useLazyGetRespondFullInfoQuery,
	useGetRespondFullInfoQuery,
	useLazyGetVacancyGroupedResponcesQuery,
	useApproveRespondMutation,
	useInviteSeekerMutation,
	useGetSupervisorVacancyQuery,
	useRequestDeleteVacancyMutation,
	useRequestCreateVacancyMutation,
	useRequestUpdateVacancyMutation,
	useGetVacancyRequestsQuery,
	useGetVacancyRequestViewQuery,
	useLazyGetVacancyRequestViewQuery,
	useAcceptCreateVacancyRequestMutation,
	useDenyVacancyRequestMutation,
	useAlterCreateVacancyRequestMutation,
	useGetArchivedResponcesQuery,
	useSendRespondToArchiveMutation,
	useDeleteRespondFromArchiveMutation,
	useGetArchivedRespondFullInfoQuery,
	useApproveArchivedRespondMutation,
	useAnswerToInivitationMainTimeMutation,
	useGetReservedResponcesQuery,
	useGetReservedRespondFullInfoQuery,
	useSendRespondToReserveMutation,
	useApproveReservedRespondMutation,
	useGetAllVacanciesQuery,
	useEditVacancyAsPerDepartmentMutation,
	useDeleteVacancyAsPerDepartmentMutation,
	useRequestCreateInterviewMutation,
	useLazyGetVacancyPreviewByDirectionQuery,
	useLazyGetVacancyPreviewBySubdivisionQuery,
	useAcceptUpdateVacancyRequestMutation,
	useAcceptDeleteVacancyRequestMutation,
	useDeleteReserveRespondMutation,
	useAlterUpdateVacancyRequestMutation,
	useGetSupervisorInterviewQuery,
	useLazyGetInterviewViewQuery,
	useEmployeeSeekerRequestMutation,
	useAnswerToInvitationReserveTimeRequestMutation,
	useAnswerEmploymentRequestMutation,
	useGetPersonnelStagesQuery,
	useGetEmploymentStageStatusQuery,
	useChangeEmploymentStageStatusRequestMutation,
	useDownloadEmploymentStageFileQuery,
	useLazyGetChatPreviewsQuery,
	useGetSeekerEmploymentRespondsQuery,
	useLazyGetEmploymentDataQuery,
	useGetEmploymentDataQuery,
	useLazyGetEmploymentDocsQuery,
	useDeleteEmploymentDocMutation,
	useGetSupervisorRespondsQuery,
	useSendEmploymentDocsMutation,
	useChangeCardStatusRequestMutation,
	useAgreeToWorkingConditionsMutation,
	useSetHasNoRequisitesOnEmploymentMutation,
	useGetSeekerResumeFileQuery,
	useLazyGetSeekerResumeFileQuery,
	useGetEmploymentReqStageStatusQuery,
	useChangeEmploymentStageAccountingStatusRequestMutation
} = serviceApi
