import { useEffect } from 'react';

/**
 * Placeholder Component
 *
 * Est utilisé comment élément de remplacement en attendant que les données enfant soit prêtes
 *
 * @param {Object} props - Props du composant
 * @param {bool} props.ready - Indique si l'arborescence enfant est prêt à être affiché
 * @param {element} props.replacement - Elements de remplacement
 */
const Placeholder = ({ready, replacement, children}) => {

  return (
    <>{ready ? children : replacement}</>
  )
}

export default Placeholder;
