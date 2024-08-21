import { CheckOutlined, CloseOutlined, LoadingOutlined } from '@ant-design/icons'
import {
	Button,
	Col,
	Descriptions,
	Form,
	Input, Popconfirm,
	Radio,
	Result,
	Row, Space,
	Spin,
	Steps,
	Table,
	Typography
} from 'antd'
import type { DescriptionsProps, TableProps } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ArrowLeftSvg } from '../../../../assets/svg'
import { EditSvg } from '../../../../assets/svg/EditSvg'
import { Item } from '../../../../models/representation'

import { EditableCell } from './EditableCell'
import PracticeModal from './practicalModal'
import { useAddSubmissionMutation, useGetAllSubmissionsQuery, useGetDocRepresentationQuery, useGetStudentsQuery } from '../../../../store/api/practiceApi/representation'
import { useGetPracticesAllQuery } from '../../../../store/api/practiceApi/individualTask'
import { showNotification } from '../../../../store/reducers/notificationSlice'
import { useAppDispatch } from '../../../../store'

const optionMock = [
	{ value: 'контракт', label: 'контракт' },
	{ value: 'бюджет', label: 'бюджет' },

]
const optionMockType = [
	{ value: '4', label: '4' },
	{ value: '5', label: '5' }
]
const optionMockKind = [
	{ value: '7', label: '7' },
	{ value: '8', label: '8' },
	{ value: '9', label: '9' }
]

export const CreateRepresentation = () => {
	const tableRef = useRef(null)
	const originData: any = [
		{
			id: 'czxczxc',
			key: 'czxczxc',
			specialtyName: 'jim',
			academicYear: '2024',
			address: 'Kazan',
			period: [dayjs('2024-07-01'), dayjs('2024-07-15')],
			courseNumber: '1',
			type: null,
			dateFilling: '2024-07-30',
			selectKind: 'Производственная',
      subdivision: '',
      groupNumber: '1',
      level: 'бакалавр'
		},
		{
			id: 'bbq',
			key: 'bbq',
			specialtyName: 'jon',
			academicYear: '2030',
			address: 'Moscw',
			period: null,
			courseNumber: '2',
			type: null,
			dateFilling: '2024-07-29',
			selectKind: 'Производственная',
      groupNumber: '1',
       level: 'бакалавр'
		},
		{
			id: 'ccx',
			key: 'ccx',
			specialtyName: 'jen',
			academicYear: '2030',
			address: 'Moscw',
			period: null,
			courseNumber: '1',
			type: null,
			dateFilling: '2024-07-28',
			selectKind: 'Производственная',
      groupNumber: '2',
       level: 'ордин'
		}
	]
	const nav = useNavigate()
	const [tableData, setTableData] = useState<any>(originData)
	const [filter, setFilter] = useState<any>({
		type: '',
		spec: '',
		courseNumber: 'Все',
		level: 'Все',
		form: '',
		dateFilling: 'По дате (сначала новые)',
		selectKind: 'Все',
		specialtyName: 'Все',
		subdivision: 'Все',
		academicYear: 'Все',
		groupNumber: 'Все'
	})
	const [form] = Form.useForm()
	const [editingKey, setEditingKey] = useState('')
	const isEditing = (record: Item) => record.key === editingKey
	const [isModalOpenOne, setIsModalOpenOne] = useState(true)
	const [selectedPractice, setSelectedPractice] = useState<any>(null)
	const [visiting,setVisiting] = useState(false)
	const [value, setValue] = useState(1);
	const [theme,setTheme] = useState('')
	const [sendSubmission,{isLoading:isLoadingAddSub}] = useAddSubmissionMutation()
	const {data:dataGetStudents,isSuccess:isSuccessGetStudents,isLoading:isLoadingStudents} = useGetStudentsQuery(selectedPractice,{skip:!selectedPractice})
	const {data:dataAllSubmissions} = useGetAllSubmissionsQuery(selectedPractice,{skip:!selectedPractice})
	const [fullTable,setFullTable] = useState<any>([])
	const [fullSelectedPractise,setFullSelectedPractise] = useState<any>([])
	const {data:dataAllPractise,isSuccess:isSuccessAllPractice} = useGetPracticesAllQuery(selectedPractice,{skip:!selectedPractice})
	const [data, setData] = useState(fullTable)
	const [step,setStep] = useState(0)
	const dispatch = useAppDispatch()
	


	useEffect(()=>{
		if(isSuccessGetStudents ){
			const newArray = dataGetStudents?.map((item:any)=>({
				name: item,
				costForDay: null,
				arrivingCost: null,
				livingCost: null,
				place: null,
				category: null,
				departmentDirector: dataAllPractise?.[0].departmentDirector,
				groupNumber: dataAllPractise?.[0].groupNumber
			}))
			setFullTable(newArray.map((item:any)=>({key: item.name, ...item})))
			setStep(1)
		}

	},[isSuccessGetStudents,isSuccessAllPractice,dataGetStudents,dataAllPractise])

	useEffect(()=>{
		if(!visiting){
			if(isSuccessGetStudents && fullTable.length>0){
				if(fullTable.every((item:any)=>item.place!==null)){
					setStep(2)
				}
			}
		}
		if(visiting){
			if(isSuccessGetStudents && fullTable.length>0){
				if(fullTable.every((item:any)=>item.place!==null && item.arrivingCost!==null && item.livingCost!==null)){
					setStep(2)
				}else{
					setStep(1)
				}
			}
		}
	},[fullTable,isSuccessGetStudents,visiting])


	const items: DescriptionsProps['items'] = [
		{
		  key: '1',
		  label: 'Подразделение',
		  children: fullSelectedPractise ? fullSelectedPractise.subdivision : '',
		},
		{
		  key: '2',
		  label: 'Наименование специальности',
		  children: fullSelectedPractise ? fullSelectedPractise.specialtyName : '',
		},

		{
		  key: '4',
		  label: 'Вид',
		  children: fullSelectedPractise ? fullSelectedPractise.practiceKind : '',
		},
		{
		  key: '5',
		  label: 'Курс',
		  children: fullSelectedPractise ? fullSelectedPractise.courseNumber : '',
		},
		{
			key: '5',
			label: 'Тип',
			children: fullSelectedPractise ? fullSelectedPractise.practiceType : '',
		},

		{
			key: '7',
			label: 'Статус',
			children:  'В ожидании',
		},
	];
	
	const columns = [
		{
			key: 'number',
			dataIndex: 'number',
			title: '№',
			className: 'text-xs !p-2',
			render: (text: any, record: any, index: any) => <div>{index + 1}</div>
		},
		{
			key: 'nane',
			dataIndex: 'name',
			title: 'ФИО обучающегося',
			name: 'ФИО обучающегося',
			className: 'text-xs !p-2'
		},

		{
			key: 'groupNumber',
			dataIndex: 'groupNumber',
			title: 'Номер группы',
			className: 'text-xs !p-2'
		},
		{
			key: 'place',
			dataIndex: 'place',
			title: 'Место прохождения практики',
			className: 'text-xs !p-2',
			editable: true
		},
		{
			key: 'departmentDirector',
			dataIndex: 'departmentDirector',
			title: 'ФИО руководителя от кафедры',
			className: 'text-xs !p-2'
		},
		{
			key: 'category',
			dataIndex: 'category',
			title: 'Категория',
			className: `text-xs !p-2 ${visiting? '' : 'hidden'}`,
			// editable: true
		},
		{
			key: 'costForDay',
			dataIndex: 'costForDay',
			title: 'Суточные (50 руб/сут)',
			className: `text-xs !p-2 ${visiting? '' : 'hidden'}`,
			editable: true
		},
		{
			key: 'arrivingCost',
			dataIndex: 'arrivingCost',
			title: 'Проезд (руб)',
			className: `text-xs !p-2 ${visiting? '' : 'hidden'}`,
			editable: true
		},
		{
			key: 'livingCost',
			dataIndex: 'livingCost',
			title: 'Оплата проживания (руб)',
			className: `text-xs !p-2 ${visiting? '' : 'hidden'}`,
			editable: true
		},
		{
			title: '',
			dataIndex: 'operation',
			render: (_: any, record: Item) => {
				const editable = isEditing(record)
				return editable ? (
					<div className="flex justify-around items-center w-[60px]">
						<Typography.Link
							onClick={() => save(record.key)}
							style={{ marginRight: 8 }}
						>
							<CheckOutlined style={{ color: '#75a4d3' }} />
						</Typography.Link>
						<Popconfirm
							title="Вы действительно хотите отменить действие?"
							onConfirm={cancel}
						>
							<CloseOutlined style={{ color: '#75a4d3' }} />
						</Popconfirm>
					</div>
				) : (
					<div className="flex justify-around items-center  w-[60px]">
						<Typography.Link
							disabled={editingKey !== ''}
							onClick={() => edit(record)}
						>
							<EditSvg />
						</Typography.Link>
						{/* <Popconfirm title="Вы действительно хотите удалить?" onConfirm={deleteRow}>
                  <a><DeleteRedSvg/></a>
              </Popconfirm> */}
					</div>
				)
			}
		}
	]

	const mergedColumns: TableProps['columns'] = columns.map(col => {
		// @ts-ignore
		if (!col.editable) {
			return col
		}
		return {
			...col,
			onCell: (record: Item) => ({
				record,
				inputType:
					col.dataIndex === 'category'
						? 'select'
						: col.dataIndex === 'selectType'
						? 'select'
						: col.dataIndex === 'selectKind'
						? 'select'
						: col.dataIndex === 'period'
						? 'date'
						: col.dataIndex === 'course'
						? 'number'
						: 'text',
				dataIndex: col.dataIndex,
				title: col.title,
				editing: isEditing(record),
				options:
					col.dataIndex === 'category'
						? optionMock
						: col.dataIndex === 'selectType'
						? optionMockType
						: col.dataIndex === 'selectKind'
						? optionMockKind
						: undefined,
				rules: visiting === false
						? ((  col.dataIndex === 'place')  ? [{
						required: true,
						message: 'Поле обязательно для заполнения'}] : [])
					 	: ((  col.dataIndex === 'place'||  col.dataIndex === 'costForDay' || col.dataIndex === 'arrivingCost' || col.dataIndex === 'livingCost')  ? [{
						required: true,
						message: 'Поле обязательно для заполнения'}] : [])
			})
		}
	})

	
	// function filterDataFull() {
	// 	function filterCourse(elem: any) {
	// 		console.log('filter.courseNumber',filter.courseNumber)
	// 		console.log('elem.courseNumber',elem.courseNumber)
	// 		if (filter.courseNumber === 'Все') {
	// 			return elem
	// 		} else {
	// 			return elem.courseNumber === filter.courseNumber
	// 		}
	// 	}
    // function filterSubdivision(elem: any) {
	// 		if (filter.courseNumber === 'Все') {
	// 			return elem
	// 		} else {
	// 			return elem.courseNumber === filter.courseNumber
	// 		}
	// 	}
	// 	function filterKind(elem: any) {
	// 		if (filter.selectKind === 'Все') {
	// 			return elem
	// 		} else {
	// 			// @ts-ignore
	// 			return elem.selectKind === filter.selectKind
	// 		}
	// 	}
    // function filterAcademicYeary(elem: any) {
	// 		if (filter.academicYear === 'Все') {
	// 			return elem
	// 		} else {
	// 			// @ts-ignore
	// 			return elem.academicYear === filter.academicYear
	// 		}
	// 	}
    // function filterNumber(elem: any) {
		  
	// 		if (filter.groupNumber === 'Все') {
	// 			return elem
	// 		} else {
	// 			// @ts-ignore
	// 			return elem.groupNumber === filter.groupNumber
	// 		}
	// 	}
	// 	function filterspecialtyName(elem: any) {
	// 		if (filter.specialtyName === 'Все') {
	// 			return elem
	// 		} else {
	// 			// @ts-ignore
	// 			return elem.specialtyName === filter.specialtyName
	// 		}
	// 	}
    // function filtersLevel(elem: any) {
	// 		if (filter.level === 'Все') {
	// 			return elem
	// 		} else {
	// 			// @ts-ignore
	// 			return elem.level === filter.level
	// 		}
	// 	}

	// 	function sortDateFilling(a: any, b: any) {
	// 		if (filter.dateFilling === 'По дате (сначала новые)') {
	// 			return +new Date(b.dateFilling) - +new Date(a.dateFilling)
	// 		}
	// 		if (filter.dateFilling === 'По дате (сначала старые)') {
	// 			return +new Date(a.dateFilling) - +new Date(b.dateFilling)
	// 		}
	// 		return 0
	// 	}

	// 	return originData
	// 		? originData
	// 				.filter((elem: any) => filterCourse(elem))
	// 				.filter((elem: any) => filterKind(elem))
	// 				.filter((elem: any) => filterspecialtyName(elem))
    //       .filter((elem: any) => filterSubdivision(elem))
    //       .filter((elem: any) => filterAcademicYeary(elem))
    //       .filter((elem: any) => filterNumber(elem))
    //       .filter((elem: any) => filtersLevel(elem))
	// 				.sort((a: any, b: any) => sortDateFilling(a, b))
	// 		: []
	// }

	const edit = (record: Partial<Item> & { key: React.Key }) => {
		form.setFieldsValue({ name: '', age: '', address: '', ...record })
		setEditingKey(record.key)
		// setCurrentRowValues(record);
	}

	const cancel = () => {
		setEditingKey('')
	}

	const save = async (key: React.Key) => {
		try {
			const row = (await form.validateFields()) as Item

			const newData = [...fullTable]
			console.log('newData',newData)
			const index = newData.findIndex(item => key === item.key)
			if (index > -1) {
				const item = newData[index]
				newData.splice(index, 1, {
					...item,
					...row
				})
				// setData(newData)
				setTableData(newData)
				setFullTable(newData)
				setEditingKey('')
				console.log('1', newData[index])
			} else {
				// если новая запись
				newData.push(row)
				// setData(newData)
				setTableData(newData)
				setFullTable(newData)
				setEditingKey('')
				console.log('222222', newData[index])
			}
		} catch (errInfo) {
			console.log('Validate Failed:', errInfo)
		}
		
	}

	const hanldeSelectedPractise = (id: any) => {
		setSelectedPractice(id)
		setStep(1)
		setIsModalOpenOne(false)
	}

	const showModalOne = () => {
		setIsModalOpenOne(true)
	}

	const handleOkOne = () => {
		setIsModalOpenOne(false)
	}

	const handleCancelOne = () => {
		setIsModalOpenOne(false)
	}

	const handleRowClick = (record: any) => {
		hanldeSelectedPractise(record.id)
		setFullSelectedPractise(record)

	}

	const onChange = (e: any) => {
		setValue(e.target.value);
	};

	const sendData = ()=>{
		if(fullTable.some((item:any)=>item.place===null)){
			return dispatch(showNotification({ message: 'Для сохранения необходимо заполнить "Место прохождение практики', type: 'warning' }));
		}
		const tableDataStudent = fullTable.map((item:any)=>({
			costForDay:item.costForDay, 
			arrivingCost:item.arrivingCost,
			livingCost:item.livingCost,
			name:item.name,
			place:item.place,
			category:item.category
		}))
		const obj = {
			practiceId: selectedPractice,
			isWithDeparture: visiting ? true : false,
			theme: theme,
			students: tableDataStudent
		}
		console.log('eeee',obj)
		sendSubmission(obj).unwrap()
			.then(()=>{nav('/services/practices/representation')})
			.catch((error)=>{
				    if(error.status === 409){
			        dispatch(showNotification({ message: 'Такое представление уже имеется, создайте другое', type: 'error' }));
			      }
					console.log(error)
			})
	}

	const okayModal = ()=>{
		showModalOne()
	}
	
	return (
		<Spin spinning={isLoadingAddSub}>
		<section className="container">
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<Button
						size="large"
						className="mt-1"
						icon={<ArrowLeftSvg className="w-4 h-4 cursor-pointer mt-1" />}
						type="text"
						onClick={() => {
							nav('/services/practices/representation')
						}}
					/>
					<Typography.Text className=" text-[28px] mb-14">
						Добавление представления в приказ
					</Typography.Text>
				</Col>
			</Row>
			
			<Row className="mt-4 flex items-center justify-between">
				<Col span={12} className='justify-start flex'>
				<Steps
						
						size="small"
						current={step}
						items={[
						{
							title: 'Выберите практику',
						},
						{
							title: 'Выберите тип и заполните таблицу',
						},
						{
							title: 'Сохраните представление',
						},
						]}
					/>
				</Col>
				{!selectedPractice ? 
				<Col span={24} className='justify-end flex'>
					<div>
						<Space>
							{selectedPractice ? 
							<Popconfirm
								title="Редактирование"
								description="Вы уверены, что хотите изменить практику? Все данные будут удалены."
								onConfirm={okayModal}
								okText="Да"
								cancelText="Нет"
							><Button  >Изменить практику</Button></Popconfirm> : 
							<Button  onClick={showModalOne}>Выбрать практику</Button>}
						</Space>
					</div>
				</Col>
				: null}	
			</Row>
			
			{selectedPractice ? (<>
				<Descriptions className='mt-8'  items={items} />
				<Row className='items-end'>
					 <Col span={12} flex="50%" className="mt-4 mobileFirst">
						<Radio.Group onChange={onChange} value={value}>
							<Space direction="vertical">
								<Radio value={1} onClick={()=>setVisiting(false)}>Невыездная практика</Radio>
								<Radio value={2} onClick={()=>setVisiting(true)}>Выездная практика</Radio>
							</Space>
						</Radio.Group>
				</Col>
				<Col span={12} className='justify-end flex'>
					<div>
						<Space>
							{selectedPractice ? 
							<Popconfirm
								title="Редактирование"
								description="Вы уверены, что хотите изменить практику? Все данные будут удалены."
								onConfirm={okayModal}
								okText="Да"
								cancelText="Нет"
							><Button  >Изменить практику</Button></Popconfirm> : 
							<Button  onClick={showModalOne}>Выбрать практику</Button>}
						</Space>
					</div>
				</Col>
			</Row>	
			</>) : ''}

			{visiting ? 
			<Row className='mt-4'>
				<Col span={1} className='flex items-center'>
					<label htmlFor="topic">Тема:</label>
				</Col>
				<Col span={3} className=''>
					<Input id="topic" placeholder='тема' onChange={(e) => setTheme(e.target.value)}/>	
				</Col>	
			</Row> : ''}
			
			<PracticeModal selectedPractice={selectedPractice} isModalOpenOne={isModalOpenOne} handleOkOne={handleOkOne} handleCancelOne={handleCancelOne} setFilter={setFilter} filter={filter} handleRowClick={handleRowClick}  tableRef={tableRef} tableData={tableData} />

			{selectedPractice ?
			    isLoadingStudents ? 
				<Spin className="w-full mt-20" indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}/> :
			(
				<>
					<Row className="mt-4">
						<Col flex={'auto'}>
							<Form form={form} component={false}>		
								<Table
									ref={tableRef}
									components={{
										body: {
											cell: EditableCell
										}
									}}
									bordered
									dataSource={fullTable}
									columns={mergedColumns}
									rowClassName="editable-row"
									pagination={false}
									rowKey="id"
								/>
							</Form>
						</Col>
					</Row>
					<Row className=''>
					<Col span={3} className=' mt-6' >
					<Space className="w-full ">
						<Button
							type="primary"
							className="!rounded-full"
							onClick={() => {
								sendData()
							}}
						>
							Сохранить
						</Button>
					</Space>
				</Col>
					</Row>
				</>
			) : (
				// <Result title="Выберите практику чтобы добавить представление" />
				null
			)}
		</section>
		</Spin>
	)
}

export default CreateRepresentation