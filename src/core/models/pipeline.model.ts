import  ActionType  from "@core/enum/actionType.enum";

export  default interface Pipeline {
  id: string
  name: string
  source_path: string
  sourcePath: string
  actionType: ActionType
  actionConfig: ActionType
  createdAt: Date
}