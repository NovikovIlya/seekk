import { FormingSchedule } from './FormingSchedule'
import MainSchedule from './MainSchedule';
import PracticeSchedule from './PracticeSchedule'
import {useLocation} from "react-router-dom";


export const Schedule = () => {
	const { pathname } = useLocation()
	if (pathname.includes('createSchedule')) {
		return <PracticeSchedule />
	} else {
		return <MainSchedule/>
	}
}
