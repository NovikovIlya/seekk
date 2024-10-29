import { Button, Upload } from 'antd'
import { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

import { MyDocsSvg } from '../../../../assets/svg/MyDocsSvg'
import { useAppSelector } from '../../../../store'
import {
	useDeleteEmploymentDocMutation,
	useLazyGetEmploymentDataQuery
} from '../../../../store/api/serviceApi'
import { setAllData } from '../../../../store/reducers/EmploymentDataSlice'
import { EmploymentDocsType } from '../../../../store/reducers/type'

export const FileAttachment = (
	props: EmploymentDocsType & {
		respondId: number
		stageName: string
		seventhStage: boolean
	}
) => {
	const seekerToken =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJJQU1pdHJvZmFub3ZAc3R1ZC5rcGZ1LnJ1IiwiaWF0IjoxNzExNTc3OTMwLCJleHAiOjE3MTE1ODg3MzAsInNjb3BlIjoidXNlciIsInJvbGVzIjpbeyJ1c2VySWQiOiIyNTMxNjIiLCJzZXNzaW9uSWQiOiIyNDAzMjI3MTQ4NzUxOTQ4Mjk3MzMwOTA0NzM1MzY2NyIsInNlc3Npb25IYXNoIjoiRDJBMjI1QTc0OTlGMUNFMTZDQkUwMkI5RjZDOTE3RTEiLCJkb2N1bWVudHNIYXNoIjoiQjI2Q0IwQzNFOEFDMzZENkEwQ0I1MTJDRjMwMjM3NzciLCJsb2dpbiI6IklBTWl0cm9mYW5vdiIsInR5cGUiOiJTRUVLRVIifV0sInNlc3Npb25JZCI6IjI0MDMyMjcxNDg3NTE5NDgyOTczMzA5MDQ3MzUzNjY3Iiwic2Vzc2lvbkhhc2giOiJEMkEyMjVBNzQ5OUYxQ0UxNkNCRTAyQjlGNkM5MTdFMSIsImFsbElkIjoiMTc4NDQwIiwiZW1haWwiOiJtaXRyb18wMkBtYWlsLnJ1In0.4dmYBUEDz9UzKxvxWtQhA6poTVwFOkRn-YoSzngfVUs'

	const { empData } = useAppSelector(state => state.employmentData)

	const [fileType, setFileType] = useState<string>('')
	const [isFileUploading, setIsFileUploading] = useState<boolean>(false)
	const [fileSize, setFileSize] = useState<number>(0)
	const linkRef = useRef<HTMLAnchorElement | null>(null)

	const foundDoc = empData.stages
		.find(stage => stage.type === props.stageName)
		?.documents.find(doc => doc.docType === props.name)

	if (foundDoc) {
		fetch(
			`http://localhost:8082/employment-api/v1/respond/${props.respondId}/employment/file/${foundDoc.id}`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${seekerToken}`
				}
			}
		)
			.then(res => {
				console.log(res.headers.get('content-type'))
				return res.blob().then(blob => {
					return {
						contentType: res.headers.get('content-type'),
						raw: blob
					}
				})
			})
			.then(data => {
				const blobus = new Blob([data.raw], {
					type: data.contentType as string
				})
				setFileSize(blobus.size)
				const url = window.URL.createObjectURL(blobus)
				if (linkRef.current) {
					linkRef.current.href = url
				}
			})
	}

	const dispatch = useDispatch()
	const [deleteDoc] = useDeleteEmploymentDocMutation()
	const [getEmpData] = useLazyGetEmploymentDataQuery()

	return (
		<>
			<div className="flex gap-[12px] col-start-1">
				<MyDocsSvg />
				<p>{props.name}</p>
			</div>
			{foundDoc ? (
				<>
					<a
						className="col-start-2 text-ellipsis overflow-clip pointer-events-auto"
						download={true}
						ref={linkRef}
					>
						dkaskjdasd9
					</a>
					<div className="col-start-3 ml-auto flex gap-[36px] items-center">
						<p className="">
							{Math.round(fileSize / 1000000) > 0
								? Math.round(fileSize / 1000000) + ' Мб'
								: Math.round(fileSize / 1000) > 0
								? Math.round(fileSize / 1000) + ' Кб'
								: fileSize + ' б'}
						</p>
						{!props.seventhStage && (
							<Button
								className="bg-inherit ml-auto opacity-40 underline"
								type="text"
								onClick={() => {
									deleteDoc({ respondId: props.respondId, docId: foundDoc.id })
										.unwrap()
										.then(() => {
											getEmpData(props.respondId)
												.unwrap()
												.then(data => {
													dispatch(setAllData(data))
												})
										})
								}}
							>
								Удалить
							</Button>
						)}
					</div>
				</>
			) : !props.seventhStage ? (
				<Upload
					className="col-start-3 ml-auto mr-[10%]"
					showUploadList={false}
					action={`http://localhost:8082/employment-api/v1/respond/${props.respondId}/employment/file?employmentDocDefId=${props.id}`}
					method="PUT"
					beforeUpload={file => {
						setFileType(file.type)
					}}
					headers={{
						Authorization: `Bearer ${seekerToken}`,
						'Content-Type': fileType
					}}
					onChange={options => {
						options.file.status === 'uploading'
							? setIsFileUploading(true)
							: options.file.status === 'error' ||
							  options.file.status === 'removed'
							? console.log('Произошла чудовищная ошибка')
							: (setIsFileUploading(false),
							  getEmpData(props.respondId)
									.unwrap()
									.then(data => {
										dispatch(setAllData(data))
									}))
					}}
				>
					{' '}
					<Button
						loading={isFileUploading}
						className="border-black border rounded-[5px] py-[12px] px-[20px]"
						type="text"
					>
						Добавить файл
					</Button>
				</Upload>
			) : (
				<p className="col-start-3 ml-auto">Отсутствует</p>
			)}
		</>
	)
}
