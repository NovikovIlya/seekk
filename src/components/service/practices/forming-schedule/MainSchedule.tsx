import {
    Button,
    Checkbox,
    Col,
    List,
    Popover,
    Radio,
    Row,
    Select,
    Space, Table, Tabs,
    Typography
} from 'antd'
import type {CheckboxProps, GetProp} from 'antd'
import {useEffect, useState} from 'react'
import {CompressedView} from "./CompressedView";
import {TableView} from "./TableView";
import {useNavigate} from "react-router-dom";
import { useCreateDocumentQuery, useGetDocQuery } from '../../../../store/api/practiceApi/formingSchedule';

import i18next from 'i18next'

type CheckboxValueType = GetProp<typeof Checkbox.Group, 'value'>[number]

interface FilterType {
    value: string
    label: string
}

const filterSpecialization: FilterType[] = [
    {
        value: '',
        label: 'Все'
    },
    {
        value: '31.08.01 Акушерство и гинекология',
        label: '31.08.01 Акушерство и гинекология'
    },
    {
        value: '31.08.01 Педиатрия',
        label: '31.08.01 Педиатрия'
    }
]
const filterCourse: FilterType[] = [
    {
        value: '',
        label: 'Все'
    },
    {
        value: '1',
        label: '1'
    },
    {
        value: '2',
        label: '2'
    },
    {
        value: '3',
        label: '3'
    },
    {
        value: '4',
        label: '4'
    },
    {
        value: '5',
        label: '5'
    },
    {
        value: '6',
        label: '6'
    }
]
const filterType: FilterType[] = [
    {
        value: '',
        label: 'Все'
    },
    {
        value: 'Производственная',
        label: 'Производственная'
    },
    {
        value: 'Технологическая',
        label: 'Технологическая'
    }
]
const filterEducationLevel: FilterType[] = [
    {
        value: '',
        label: 'Все'
    },
    {
        value: 'Ординатура',
        label: 'Ординатура'
    },
    {
        value: 'Интернатура',
        label: 'Интернатура'
    }
]
const filterEducationForm: FilterType[] = [
    {
        value: '',
        label: 'Все'
    },
    {
        value: 'Очная',
        label: 'Очная'
    },
    {
        value: 'Заочная',
        label: 'Заочная'
    },
    {
        value: 'Очно - заочная',
        label: 'Очно - заочная'
    }
]

interface DataType {
    key: string
    specialization: string
    fillingDate: string
    type: string
    course: string
    academicYear: string
    group: string
    educationLevel: string
    educationForm: string
    sybtypePractice: string
    periodPractice: string
}

const data: DataType[] = [
    {
        key: '1',
        specialization: 'Лечебно-профилактическое учреждение по договору',
        fillingDate: '00.00.00, 00:00',
        type: 'Бессрочный',
        course: '1',
        academicYear: '2',
        group: '09-033',
        educationLevel: 'Ординатура',
        educationForm: 'Очная',
        sybtypePractice: 'Акушерство',
        periodPractice: '2020-2021'
    },
    {
        key: '2',
        specialization: 'Лечебно-профилактическое учреждение по договору',
        fillingDate: '00.00.00, 00:00',
        type: 'С пролонгацией',
        course: '2',
        academicYear: '2',
        group: '09-033',
        educationLevel: 'Ординатура',
        educationForm: 'Заочная',
        sybtypePractice: 'Акушерство',
        periodPractice: '2020-2021'
    }
]

const plainOptions = data.map(item => item.key)


export const PracticeSchedule = () => {
    const navigate = useNavigate()
    const [tableData, setTableData] = useState([])
    const [year,setYear] = useState('2023/2024')
    const {data:dataCreate} = useCreateDocumentQuery('2023/2024')
    const {data:dataBlob,isLoading:isLoadingBlob} = useGetDocQuery(year,{skip:!year})
    const [stateSchedule, setStateSchedule] = useState({
        compressed: true,
        table: false,
    })
    const [dataTable, setDataTable] = useState<DataType[]>(data)
    const [filters, setFilters] = useState<{
        type: string
        spec: string
        course: string
        level: string
        form: string
    }>({type: '', spec: '', course: '', level: '', form: ''})

    useEffect(() => {
        setDataTable(
            data.filter(
                x =>
                    x.type.includes(filters.type) &&
                    x.specialization.includes(filters.spec) &&
                    x.course.includes(filters.course) &&
                    x.educationLevel.includes(filters.level) &&
                    x.educationForm.includes(filters.form)
            )
        )
    }, [filters])

    const filter = (value: string, index: string) => {
        setFilters(prev => ({...prev, [index]: value}))
    }

    function isCompressedView() {
        setStateSchedule({
            ...stateSchedule,
            compressed: true,
            table: false
        })
    }
    console.log('blobblob',dataBlob)
    function isTableView() {
        setStateSchedule({
            ...stateSchedule,
            compressed: false,
            table: true,
        })
    }
    const downloadFile = () => {
        if(dataBlob){
        const link = document.createElement('a');
        link.href = dataBlob;
        link.setAttribute('download', 'downloaded-file.docx');
        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(dataBlob); 
        }
      }

      const columns = [
		{
			key: 'Name',
			dataIndex: 'Name',
			title: 'Наименование документа',
			name: 'Наименование документа',
			className: 'text-xs !p-2',
			
		},
		
		{
            title: 'Дата заполнения',
            dataIndex: 'dateFilling',
            width: '20%',
            // @ts-ignore
            render: (text:any) => dayjs(text).format('DD.MM.YYYY')
        },
		{
			key: 'academicYear',
			dataIndex: 'academicYear',
			title: 'Учебный год',
			className: 'text-xs !p-2'
		},
		{
			key: 'period',
			dataIndex: 'period',
			title: 'Период практики',
			className: 'text-xs !p-2'
		},
		
	
	]
 

    console.log('dataCreate',dataCreate)

    return (
        <section className="container">
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Typography.Text className=" text-[28px] mb-14">
                        График практик
                    </Typography.Text>
                    
                </Col>
            </Row>
            <Row gutter={[16, 16]} className="mt-12">
                <Col span={5}>
                    <span>Подразделение</span>
                </Col>
                <Col span={7}>
                    <Select
                        popupMatchSelectWidth={false}
                        defaultValue="Все"
                        className="w-full"
                        
                    />
                </Col>
                <Col span={7} offset={5}>
                    <Space className="w-full flex-row-reverse">
                        <Button
                            type="primary"
                            className="!rounded-full"
                            onClick={() => {
                                navigate('/services/practices/formingSchedule/createSchedule')
                            }}
                        >
                            Добавить график практик
                        </Button>
                    </Space>
                </Col>
            </Row>
            <Row gutter={[16, 16]} className="mt-4">
                <Col span={5}>
                    <span>Учебный год</span>
                </Col>
                <Col span={7}>
                    <Select
                        popupMatchSelectWidth={false}
                        defaultValue="Все"
                        className="w-full"
                       
                        
                    />
                </Col>
                </Row>
            {/* {
                stateSchedule.table
                &&
                <>
                    <Row gutter={[16, 16]} className="mt-4 flex items-center">
                        <Col span={4}>
                            <Typography.Text>Уровень образования</Typography.Text>
                        </Col>
                        <Col span={8}>
                            <Select
                                popupMatchSelectWidth={false}
                                defaultValue=""
                                className="w-full"
                                options={filterEducationLevel}
                                onChange={value => filter(value, 'level')}
                            />
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]} className="mt-4 flex items-center">
                        <Col span={4}>
                            <Typography.Text>Форма обучения</Typography.Text>
                        </Col>
                        <Col span={8}>
                            <Select
                                popupMatchSelectWidth={false}
                                defaultValue=""
                                className="w-full"
                                options={filterEducationForm}
                                onChange={value => filter(value, 'form')}
                            />
                        </Col>
                    </Row>
                </>
            } */}
            <Row className="mt-4 flex items-center">
                {/* <Col span={12} flex="50%">
                    <Radio.Group defaultValue="compressedView" buttonStyle="solid">
                        <Radio.Button
                            value="compressedView"
                            className="!rounded-l-full"
                            onClick={isCompressedView}>
                            Посмотреть в сжатом виде
                        </Radio.Button>
                        <Radio.Button
                            value="tableView"
                            className="!rounded-r-full"
                            onClick={isTableView}>
                            Посмотреть данные в таблице
                        </Radio.Button>
                    </Radio.Group>
                </Col> */}
                
            </Row>

            <Row className="mt-4">
                <Col flex={'auto'}>
                    {/* {stateSchedule.compressed && <CompressedView/>}
                    {stateSchedule.table && <TableView/>} */}
                    <Table
					size="small"
					rowKey="id"
					// @ts-ignore
					columns={columns}
					dataSource={tableData ? tableData : []}
					pagination={false}
					className="my-10"
					// rowSelection={{
					// 	type: 'checkbox',
					// 	onSelect: (record, selected, selectedRows, nativeEvent) => {
					// 		setSelectedFieldFull(selectedRows)
					// 	},
					// 	onSelectAll: (selected, selectedRows, changeRows) => {
					// 		setSelectedFieldFull(selectedRows)
					// 	}
					// }}
				/>
                </Col>
            </Row>
        </section>
    )
}

export default PracticeSchedule
function dayjs(text: any) {
    throw new Error('Function not implemented.');
}

