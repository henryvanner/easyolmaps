export class XMLNode {
    constructor(name, attrs = {}, children = []) {
        this.name = name;
        this.attrs = attrs;
        this.children = children;
    }
    append(child) {
        this.children.push(child);
    }
    setAttribute(key, value) {
        this.attrs[key] = value;
    }
    toString() {
        const { name, attrs, children } = this;
        let arr = [], content, attrsLine;
        for (let key in attrs) {
            if (attrs.hasOwnProperty(key)) {
                arr.push(`${key}="${attrs[key]}"`);
            }
        }
        content = children.map(c => c.toString()).join('');
        attrsLine = arr.join(' ');
        attrsLine = attrsLine ? ' ' + attrsLine : '';
        return (`<${name}${attrsLine}>${content}</${name}>`);
    }
}

export class WPSInput extends XMLNode {
    constructor(identifier, inputDataFormChoice) {
        super('wps:Input', {}, [
            new XMLNode('ows:Identifier', {}, [identifier]),
            inputDataFormChoice
        ])
    }
}

export class WPSLiteralData extends XMLNode {
    constructor(literalData) {
        super('wps:Data', {}, [
            new XMLNode('wps:LiteralData', {}, [literalData])
        ]);
    }
}

export class WPSComplexData extends XMLNode {
    constructor({ complexDataEncoding } = {}, complexData) {
        super('wps:Data', {}, [
            new XMLNode('wps:ComplexData', { ...complexDataEncoding }, [complexData])
        ])
    }
}

export class WPSRawDataOutput extends XMLNode {
    constructor(identifier, { complexDataEncoding = {}, ...restProps } = {}) {
        super('wps:ResponseForm', {}, [
            new XMLNode('wps:RawDataOutput', { ...complexDataEncoding, ...restProps }, [
                new XMLNode('ows:Identifier', {}, [identifier])
            ])
        ])
    }
}

export class WFSGetFeature extends XMLNode {
    constructor(props, query) {
        super('wfs:GetFeature', props, [query]);
    }
}

export class WFSQuery extends XMLNode {
    constructor(props) {
        super('wfs:Query', props);
    }
}

export class WPSInputReference extends XMLNode {
    constructor({ complexDataEncoding, ...restProps } = {}, children) {
        super('wps:Reference', { ...complexDataEncoding, ...restProps }, children);
    }
}

export class WPSExecute extends XMLNode {
    constructor(identifier, props, inputs, output) {
        super('wps:Execute', props, [
            new XMLNode('ows:Identifier', {}, [identifier]),
            new XMLNode('wps:DataInputs', {}, inputs),
            output
        ]);
    }
}