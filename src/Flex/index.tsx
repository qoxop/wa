import React from 'react';

const A = (props: any) => (<div>a - {props.children}</div>)

const B = (props: any) => (<A>b - {props.children}</A>)
 
const C = (props: any) => (<B>c - {props.children}</B>)

export default <C>666</C>