const ufMap = new Map<string, string>([
  ['Paraná', 'PR'],
  ['Amazônia', 'AM'],
  ['Ceará', 'CE'],
  ['Maranhão', 'MA'],
  ['Pernambuco', 'PE'],
  ['Piauí', 'PI'],
  ['Rondônia', 'RO'],
  ['Sergipe', 'SE'],
  ['Distrito Federal', 'DF'],
  ['São Paulo', 'SP'],
  ['Santa Catarina', 'SC'],
  ['Rio Grande do Sul', 'RS'],
  ['Rio Grande do Norte', 'RN'],
  ['Goiás', 'GO'],
  ['Rio de Janeiro', 'RJ'],
  ['Mato Grosso do Sul', 'MS'],
  ['Mato Grosso do Norte', 'MT'],
  ['Tocantins', 'To'],
  ['Roraima', 'RR'],
  ['Pará', 'PA'],
  ['Acre', 'AC'],
  ['Espirito Santo', 'ES'],
  ['Bahia', 'Ba'],
  ['Recife', 'RE']
])

export class ConvertUf {
  public static encode(uf: string): string | undefined {
    if (/^[A-Z]{2}$/.test(uf)) return uf

    return ufMap.get(uf)
  }
}
