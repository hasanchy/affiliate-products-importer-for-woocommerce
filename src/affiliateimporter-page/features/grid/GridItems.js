import React from 'react';
import { setPixels } from './gridSlice';
import { useDispatch, useSelector } from 'react-redux';

const GridItems = (props) => {
    const {pixelData, isMouseDown, selectedColor } = useSelector((state) => state.grid);
    const dispatch = useDispatch();


    const changeGridColor = () => {
        if(pixelData[props.index] !== selectedColor){
            let pixelsState = [...pixelData]
            pixelsState[props.index] = selectedColor;
            dispatch(setPixels(pixelsState));
        }
    }

    const handleMouseMove = () => {
        if(isMouseDown){
            changeGridColor()
        }
    }

    const handleMouseDown = () => {
        changeGridColor()
    }
    
    return (
        <div draggable="false" key={props.index} className="grid-item" style={{backgroundColor:props.color}} onMouseMove={handleMouseMove} onMouseDown={handleMouseDown}/>
    )
}

export default GridItems