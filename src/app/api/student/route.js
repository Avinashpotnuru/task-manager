import { NextResponse } from "next/server";

const GET=async()=>{
    
    return NextResponse.json({name:"avinash"});
    
}

export {GET};