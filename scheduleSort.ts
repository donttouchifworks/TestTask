interface task {
    start: number,
    end: number,
}

export default function findOptimalSchedule(tasks: Array<Array<string>>, schedule : Array<string>){
    const startTime = new Date(schedule[0]).getTime()
    const endTime = new Date(schedule[1]).getTime()

    const optimalSchedule = []
    tasks.sort()

    for(let i = 0; i < tasks.length; i++){
        const currentTask = {
            start: new Date(tasks[i][0]).getTime(),
            end: new Date(tasks[i][1]).getTime(),
        }
        if(currentTask && isScheduleRestrictions(currentTask, startTime, endTime)) {
            continue
        }
        if(currentTask.start > endTime) break


        let nextTask;
        if(tasks[i+1]){
            nextTask = {
                start: new Date(tasks[i+1][0]).getTime(),
                end: new Date(tasks[i+1][1]).getTime(),
            }
        }

        //no conflicts first
        if(optimalSchedule.length === 0 && nextTask && nextTask.start > currentTask.end ){
            optimalSchedule.push(tasks[i])
            continue
        }

        let prevTask;
        if(optimalSchedule.length > 0){
            prevTask = {
                start: new Date(optimalSchedule[optimalSchedule.length - 1][0]).getTime(),
                end: new Date(optimalSchedule[optimalSchedule.length - 1][1]).getTime()
            }
        }


        if(prevTask && (prevTask.end > currentTask.start) || prevTask && prevTask.end > currentTask.start) continue

        if (!(nextTask && nextTask.start < currentTask.end || nextTask && nextTask.start == currentTask.start)) {
            optimalSchedule.push(tasks[i])
        } else {
            const a = tasks.slice(i)
            a.splice(1, 1)
            const first = countTotalTime(a, endTime)
            const second = countTotalTime(tasks.slice(i + 1), endTime)
            if(first > second) optimalSchedule.push(tasks[i])
        }

    }

    return optimalSchedule
}

function countTotalTime(tasks: Array<Array<string>>, shiftEnd: number){
    return tasks.reduce((acc: number, currentValue) => {
        if (new Date(currentValue[0]).getTime() < shiftEnd) {
            return acc + new Date(currentValue[1]).getTime() - new Date(currentValue[0]).getTime()
        }
        return acc
    }, 0)
}

function isScheduleRestrictions(task: task, startTime: number, endTime: number){
    if(task.start < startTime) return true
    else if(task.end > endTime) return true
    return false
}
