import { DocumentIcon } from '../../../../../assets/svg/DocumentIcon'
import {
	useDownloadEmploymentStageFileQuery,
} from '../../../../../store/api/serviceApi'

interface DocumentElemProps {
	name: string
	id: number
}

export const DocumentElem = (props: DocumentElemProps) => {
	// ругается - не работает, все переделать
	const download = useDownloadEmploymentStageFileQuery

	const downloadFile = async (fileName: string, fileId: number) => {
		console.log('downloading...')
		try {
			const { data: fileBlob } = download({ fileId: fileId });
			if (fileBlob) {
				const link = document.createElement('a');
				link.href = window.URL.createObjectURL(fileBlob);
				link.download = fileName;
				link.click();
			} else {
				console.error('Файл не найден');
			}
		} catch (error) {
			console.error('Произошла ошибка при загрузке файла', error);
		}
	};
	return (
		<button
			className="flex flex-row min-w-[500px] w-[50%] justify-between cursor-pointer bg-white border-none
      hover:opacity-[80%]"
			onClick={() => {
				console.log('click')
				downloadFile(props.name, props.id)
			}}>
			<div className='flex flex-row items-center'>
				<DocumentIcon />
				<span className="underline font-normal ml-[12px] underline-offset-2 text-[16px]/[19.2px] ">
          {props.name}
        </span>
			</div>
			{/*
			<span className="font-normal opacity-[70%] text-[16px]/[19.2px]">
         xz
      </span>
			*/}
		</button>
	)
}