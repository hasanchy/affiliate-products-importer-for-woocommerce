import React, {useEffect} from 'react';
import GridItems from './GridItems';
import { useDispatch, useSelector } from 'react-redux';
import { setIsMouseDown } from './gridSlice';

const Grid = () => {
    const {pixelData } = useSelector((state) => state.grid);
    const dispatch = useDispatch();
    
    useEffect(() => {

        const handleMouseUp = () => {
            dispatch(setIsMouseDown(false))
        };

        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('dragover', handleMouseUp);

        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('dragover', handleMouseUp);
        };

    }, []);

    const renderGridItems = () => {
        let gridItems = [];

        pixelData.forEach((color, index)=>{
            gridItems.push(<GridItems index={index} color={color} key={index}/>)
        })

        return gridItems;
    }

    const handleMouseDown = () =>{
        console.log('Mouse button is down');
        dispatch(setIsMouseDown(true))
    }

    return (
        <div draggable="false" className="grid-container" onMouseDown={handleMouseDown}>
            {renderGridItems()}
        </div>
    )
}

export default Grid